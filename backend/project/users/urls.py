from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import CompanyProfileView
from .import views
# 1. إعداد الـ Router
router = DefaultRouter()
router.register(r'offers', views.OfferViewSet, basename='offer')
router.register(r'applications', views.ApplicationViewSet, basename='application')
router.register(r'admin/students', views.AdminStudentViewSet, basename='admin-students')

urlpatterns = [
    # روابط الـ ViewSets
    path('', include(router.urls)),

    # 2. روابط الحساب والتسجيل
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    
    # 3. روابط الإحصائيات (Dashboard Stats)
    path('dashboard-stats/', views.get_dashboard_stats, name='dashboard-stats'),
    path('admin/stats/', views.get_admin_overall_stats, name='admin-stats'),

    # 4. روابط الإدارة (Admin)
    path('admin/pending-companies/', views.get_pending_companies, name='pending-companies'),
    path('admin/approve-company/<int:pk>/', views.approve_company, name='admin-approve-company'),

    # 5. روابط الشركة (Company Applications)
    # ملاحظة: تم تغيير المسار ليتوافق مع طلب الفرونت-إند (applications بالجمع)
    path('company/applications/', views.get_company_applications, name='company-apps'),
    path('admin/generate-agreement/<int:application_id>/', views.generate_agreement_pdf, name='generate-agreement'),
    path('admin/accepted-applications/', views.get_accepted_applications, name='accepted-apps'),
    path('company/profile/',CompanyProfileView.as_view()),
]
