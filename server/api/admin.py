from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(EquipmentItem)
admin.site.register(EquipmentType)
admin.site.register(EquipmentCategory)
admin.site.register(EquipmentRequest)