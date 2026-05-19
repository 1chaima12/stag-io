from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver


# 1. المستخدم المخصص
class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('company', 'Company'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    fullname = models.CharField(max_length=255, blank=True)

    def str(self):
        return self.fullname if self.fullname else self.username


# 2. ملف الطالب
class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    university = models.CharField(max_length=255, blank=True)
    wilaya = models.CharField(max_length=100, blank=True)
    digital_cv = models.FileField(upload_to='cvs/', null=True, blank=True)
    skills = models.JSONField(default=list, blank=True)

    def str(self):
        return self.user.fullname if self.user.fullname else self.user.username


# 3. ملف الشركة
class Company(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='company_profile', null=True, blank=True)

    # معلومات أساسية
    name        = models.CharField(max_length=255)
    email       = models.EmailField(unique=True)
    phone       = models.CharField(max_length=50, blank=True)
    website     = models.CharField(max_length=255, blank=True)
    linkedin    = models.CharField(max_length=255, blank=True)

    # الموقع
    wilaya      = models.CharField(max_length=100, blank=True)
    address     = models.CharField(max_length=255, blank=True)

    # معلومات الشركة
    sector      = models.CharField(max_length=100, blank=True)
    size        = models.CharField(max_length=50, blank=True)
    founded     = models.CharField(max_length=10, blank=True)
    description = models.TextField(blank=True)
    logo        = models.ImageField(upload_to='logos/', null=True, blank=True)

    # إحصائيات
    offers_count   = models.IntegerField(default=0)
    accepted_count = models.IntegerField(default=0)
    is_validate    = models.BooleanField(default=False)

    def str(self):
        return self.name


# 4. عروض التربص
class Offer(models.Model):
    TYPE_CHOICES = (
        ('On-site', 'On-site'),
        ('Remote', 'Remote'),
        ('Hybrid', 'Hybrid'),
    )
    company     = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='offers')
    title       = models.CharField(max_length=255)
    description = models.TextField()
    wilaya      = models.CharField(max_length=100)
    type        = models.CharField(max_length=20, choices=TYPE_CHOICES)
    domain      = models.CharField(max_length=100, blank=True)
    duration    = models.CharField(max_length=50, blank=True)
    is_active   = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    def str(self):
        return self.title


# 5. التقديمات
class Application(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    )
    student    = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='applications')
    offer      = models.ForeignKey(Offer, on_delete=models.CASCADE, related_name='applications')
    message    = models.TextField(blank=True)
    status     = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def str(self):
        return f"{self.student.user.username} - {self.offer.title}"


# 6. اتفاقية التربص
class InternshipAgreement(models.Model):
    application      = models.OneToOneField(Application, on_delete=models.CASCADE, related_name='agreement')
    start_date       = models.DateField()
    end_date         = models.DateField()
    validated        = models.BooleanField(default=False)
    reference_number = models.CharField(max_length=100, unique=True, blank=True, null=True)
    def str(self):
        return f"Agreement for {self.application.student.user.fullname}"


@receiver(post_save, sender=User)
def create_student_profile(sender, instance, created, **kwargs):
    if created and instance.role == 'student':
        Student.objects.get_or_create(user=instance)