from gwSites.influBuild.initDb import initDatabase
from gwSites.influBuild.models import Building
from gwSites.influBuild.forms import ContactForm
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.core.mail import send_mail
#from django.utils.translation import ugettext_lazy as _
# Create your views here.

def initDb(request):
	initDatabase()
	return HttpResponseRedirect('/')
	
def home(request):
	allB=Building.objects.order_by('shortName')#['Pol','Art','Eco','Arc']
	form = ContactForm()
	return render(request,'influMainPage.html',
				 {'listFam':{'Architecture':allB.filter(family='Arc'),'Politics':allB.filter(family='Pol'),'Art Of War':allB.filter(family='Art'),'Economy':allB.filter(family='Eco')},
				 'form':form})
							 
def contact(request):
	if request.POST:
		form = ContactForm(request.POST)
		if form.is_valid():
			send_mail(form.cleaned_data['subject'],form.cleaned_data['message'],form.cleaned_data['sender'],["gestion@cladiere.eu"])
			#if request.is_ajax():
				#print("a")
				#return render (request, 'form.html', {'form' : form })
		return render (request, 'form.html', {'form' : form })
	return redirect('home')		