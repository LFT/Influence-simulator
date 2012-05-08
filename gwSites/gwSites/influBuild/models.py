from django.db import models

# Create your models here.

class Building(models.Model):
	name = models.CharField(max_length=30)
	shortName = models.CharField(max_length=7,primary_key=True)
	cost = models.IntegerField(default=200)
	timeToBuild = models.IntegerField(default=6)
	isRepetable = models.BooleanField(default=True)
	family = models.CharField(max_length=30)
	parent = models.ForeignKey('self', blank = True, null = True, related_name = '%(app_label)s_%(class)s_descendant')
	otherDep = models.ForeignKey('self', blank = True, null = True, related_name = '%(app_label)s_%(class)s_otherDesc')
	
	def __unicode__(self):
		return u'%s' % (self.shortName)
