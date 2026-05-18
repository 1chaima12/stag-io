from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Offer, Student, Company, Application # أضفنا الموديلات الناقصة هنا

class CustomUserAdmin(UserAdmin):
    fieldsets = list(UserAdmin.fieldsets) + [
        ('Extra Info', {'fields': ('role', 'fullname')}),
    ]
    list_display = ['email', 'username', 'fullname', 'role', 'is_staff', 'is_active']
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('email', 'username', 'fullname')
    ordering = ('email',)

admin.site.register(User, CustomUserAdmin)

@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ['title', 'company', 'wilaya', 'type', 'is_active']
    list_filter = ('type', 'is_active', 'wilaya')
    search_field=['title','company__name']
# --- أضف الأسطر التالية لتظهر الجداول الناقصة ---

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('user', 'university','wilaya')
    search_fields = ('user__username', 'university')

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name','email','wilaya']
    search_fields=['wilaya']

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['student', 'offer', 'status', 'created_at']
    list_filter = ('status',)