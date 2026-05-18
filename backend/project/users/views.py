from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from .models import Offer, Application, User, Student, Company
from .serializers import (
    OfferSerializer,
    ApplicationSerializer,
    RegisterSerializer,
    CompanySerializer,
    StudentSerializer,
)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import json
from django.http import HttpResponse
# ───────────────────────────────────────────
# 1. العروض والطلبات (ViewSets)
# ───────────────────────────────────────────
class OfferViewSet(viewsets.ModelViewSet):
    serializer_class = OfferSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Offer.objects.all().order_by('-id')

    def perform_create(self, serializer):
        company = Company.objects.filter(user=self.request.user).first()
        if not company:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"detail": "فقط الشركات يمكنها إنشاء عروض."})
        serializer.save(company=company)

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        company = Company.objects.filter(user=user).first()
        if company:
            return Application.objects.filter(offer__company=company).order_by('-id')
        return Application.objects.filter(student__user=user).order_by('-id')

    def perform_create(self, serializer):
        student_profile, _ = Student.objects.get_or_create(user=self.request.user)
        serializer.save(student=student_profile)

# ───────────────────────────────────────────
# 2. داشبورد الشركة (Dashboard)
# ───────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard_stats(request):
    company = Company.objects.filter(user=request.user).first()

    if not company:
        return Response({
            "error": "Company profile not found",
            "logged_in_as": request.user.email,
            "hint": "تأكد من ربط هذا المستخدم بشركة في لوحة تحكم Django Admin"
        }, status=404)

    stats = {
        "active_offers": Offer.objects.filter(company=company).count(),
        "total_applicants": Application.objects.filter(offer__company=company).count(),
        "pending_review": Application.objects.filter(offer__company=company, status='Pending').count(),
        "accepted_interns": Application.objects.filter(offer__company=company, status='Accepted').count(),
    }

    recent_applicants = Application.objects.filter(offer__company=company).order_by('-id')[:5]
    serializer = ApplicationSerializer(recent_applicants, many=True)

    return Response({
        "stats": stats,
        "recent_applicants": serializer.data,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_company_applications(request):
    company = Company.objects.filter(user=request.user).first()
    if not company:
        return Response({"error": "Company not found"}, status=404)
    
    apps = Application.objects.filter(offer__company=company).order_by('-id')
    serializer = ApplicationSerializer(apps, many=True)
    return Response(serializer.data)

# ───────────────────────────────────────────
# 3. إدارة الأدمن (Admin)
# ───────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_admin_overall_stats(request):
    stats = {
        "total_users": User.objects.count(),
        "total_companies": Company.objects.count(),
        "total_offers": Offer.objects.count(),
        "pending_companies": Company.objects.filter(is_validate=False).count(),
    }
    return Response(stats)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_pending_companies(request):
    companies = Company.objects.all()
    serializer = CompanySerializer(companies, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def approve_company(request, pk):
    try:
        company = Company.objects.get(pk=pk)
        company.is_validate = True
        company.save()
        return Response({"message": "تم تفعيل الشركة بنجاح!"})
    except Company.DoesNotExist:
        return Response({"error": "الشركة غير موجودة"}, status=404)

class AdminStudentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = Student.objects.all().order_by('-id')
    serializer_class = StudentSerializer

# ───────────────────────────────────────────
# 4. الحساب والبروفايل
# ───────────────────────────────────────────
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student, _ = Student.objects.get_or_create(user=request.user)
        return Response({
            "username": request.user.username,
            "fullname": request.user.fullname,
            "role": getattr(request.user, 'role', 'student'),
            "student_details": {
                "university": student.university,
                "wilaya": student.wilaya,
            }
        })

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from io import BytesIO

@api_view(['GET'])
@permission_classes([IsAdminUser])
def generate_agreement_pdf(request, application_id):
    try:
        app = Application.objects.get(id=application_id)
        student = app.student
        company = app.offer.company

        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4

        # العنوان
        p.setFont("Helvetica-Bold", 16)
        p.drawCentredString(width/2, height-80, "Convention de Stage")
        
        p.setFont("Helvetica", 12)
        p.drawCentredString(width/2, height-110, "Internship Agreement")

        # خط فاصل
        p.line(50, height-130, width-50, height-130)

        # بيانات الطالب
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, height-170, "Student Information:")
        p.setFont("Helvetica", 11)
        p.drawString(70, height-195, f"Name: {student.user.fullname or student.user.username}")
        p.drawString(70, height-215, f"University: {student.university}")
        p.drawString(70, height-235, f"Wilaya: {student.wilaya}")

        # بيانات الشركة
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, height-275, "Company Information:")
        p.setFont("Helvetica", 11)
        p.drawString(70, height-300, f"Company: {company.name}")
        p.drawString(70, height-320, f"Sector: {company.sector}")
        p.drawString(70, height-340, f"Wilaya: {company.wilaya}")

        # بيانات التربص
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, height-380, "Internship Details:")
        p.setFont("Helvetica", 11)
        p.drawString(70, height-405, f"Position: {app.offer.title}")
        p.drawString(70, height-425, f"Duration: {app.offer.duration}")
        p.drawString(70, height-445, f"Type: {app.offer.type}")

        # التوقيعات
        p.line(50, 150, width-50, 150)
        p.setFont("Helvetica-Bold", 11)
        p.drawString(70, 130, "Student Signature:")
        p.drawString(width-200, 130, "Company Signature:")
        p.drawString(width/2-60, 130, "Admin Signature:")

        p.save()
        buffer.seek(0)

        return HttpResponse(buffer.read(), content_type='application/pdf',
            headers={'Content-Disposition': f'attachment; filename="agreement_{application_id}.pdf"'})

    except Application.DoesNotExist:
        return Response({"error": "Application not found"}, status=404)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_accepted_applications(request):
    apps = Application.objects.filter(status='accepted')
    serializer = ApplicationSerializer(apps, many=True)
    return Response(serializer.data)