from rest_framework import serializers
from .models import User, Offer, Application, Student, Company


class UserSerializer(serializers.ModelSerializer):
    student_id = serializers.ReadOnlyField(source='student_profile.id')

    class Meta:
        model = User
        fields = ['id', 'username', 'fullname', 'role', 'email', 'student_id']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'fullname', 'email', 'password', 'role')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            fullname=validated_data.get('fullname', ''),
            role=validated_data.get('role', 'student')
        )
        return user


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class OfferSerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField()

    class Meta:
        model = Offer
        fields = [
            'id', 'title', 'description', 'wilaya',
            'type', 'duration', 'domain',
            'is_active', 'company', 'company_name'
        ]
        read_only_fields = ['company']

    def get_company_name(self, obj):
        return obj.company.name if obj.company else ""

    def create(self, validated_data):
        request = self.context.get('request')
        if not request or not request.user:
            raise serializers.ValidationError({"detail": "يجب تسجيل الدخول أولاً."})
        user = request.user
        try:
            company = Company.objects.get(user=user)
            validated_data['company'] = company
            return super().create(validated_data)
        except Company.DoesNotExist:
            raise serializers.ValidationError({"detail": "هذا الحساب ليس له بروفايل شركة."})


class ApplicationSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    university = serializers.SerializerMethodField()
    wilaya = serializers.SerializerMethodField()
    skills = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = ['id', 'offer', 'status', 'created_at', 'student_name', 'university', 'wilaya', 'skills']
        read_only_fields = ['student']

    def get_student_name(self, obj):
        return obj.student.user.fullname or obj.student.user.username

    def get_university(self, obj):
        return obj.student.university

    def get_wilaya(self, obj):
        return obj.student.wilaya

    def get_skills(self, obj):
        return obj.student.skills or []


class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Student
        fields = '__all__'
        read_only_fields = ['user']