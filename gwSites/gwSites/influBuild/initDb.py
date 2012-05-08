from gwSites.influBuild.models import Building
#this is just here for translation needs
#from django.utils.translation import ugettext_lazy as _

def initDatabase():
	Building.objects.all().delete()
	familyList = ['Politics','Art Of War','Economy', 'Architecture']
	familyIds = ['Pol','Art','Eco','Arc']
	levelCost =  [500,1000,5000,7500,10000]
	levelTime = [2,6,18,30,42]
	for fam in range(0,4):
		prevBuild = None 
		for i in range(1,6):
			b = Building(name = familyList[fam] + ' Level ' + str(i), shortName = familyIds[fam] + str(i), family = familyIds[fam], parent = prevBuild, isRepetable = False, cost = levelCost[i-1], timeToBuild = levelTime[i-1])
			b.save()
			prevBuild = b
	basics = Building.objects.all()
	#Politics
	currentFam = familyIds[0]
	currentReq = basics.get(shortName = currentFam + '1')
	Building.objects.create(name = '+5% Influence for 24h', shortName = currentFam + '11', family = currentFam, parent = currentReq, cost = 50)
	Building.objects.create(name = 'Guild Emblem Template', shortName = currentFam + '12', family = currentFam, parent = currentReq, cost = 100, isRepetable = False)
	currentReq = basics.get(shortName = currentFam + '2')
	otherReq = Building.objects.get(shortName=currentFam + '12')
	Building.objects.create(name = '+10% Influence from Events', shortName = currentFam + '21', family = currentFam, parent = currentReq)
	Building.objects.create(name = '+5% Exp Public Banner', shortName = currentFam + '22', family = currentFam, parent = currentReq, cost = 100, timeToBuild = 3)	
	Building.objects.create(name = 'Guild Armorer Contract', shortName = currentFam + '23', family = currentFam, parent = currentReq, isRepetable = False, cost = 500, otherDep = otherReq)
	currentReq = basics.get(shortName = currentFam + '3')
	Building.objects.create(name = 'Guild Weapons Contract', shortName = currentFam + '31', family = currentFam, parent = currentReq, isRepetable = False, cost = 1000, otherDep = otherReq)
	Building.objects.create(name = 'Contract Asuran Outsourcing', shortName = currentFam + '32', family = currentFam, parent = currentReq)
	currentReq = basics.get(shortName = currentFam + '4')
	Building.objects.create(name = '+20% Dungeon Influence for 24 Hrs', shortName = currentFam + '41', family = currentFam, parent = currentReq)
	Building.objects.create(name = 'Guild Banquet', shortName = currentFam + '42', family = currentFam, parent = currentReq, cost = 1000, timeToBuild = 18)
	#Art Of War
	currentFam = familyIds[1]
	currentReq = basics.get(shortName = currentFam + '1')
	Building.objects.create(name = '+10% Influence for 3 Days', shortName = currentFam + '11', family = currentFam, parent = currentReq, cost = 100)
	currentReq = basics.get(shortName = currentFam + '2')
	Building.objects.create(name = 'WvW Fort +10% Experience', shortName = currentFam + '21', family = currentFam, parent = currentReq, timeToBuild = 2)
	Building.objects.create(name = 'WvW Fort +10% Magic Find', shortName = currentFam + '22', family = currentFam, parent = currentReq, timeToBuild = 2)
	Building.objects.create(name = 'WvW Fort +5 Supply', shortName = currentFam + '23', family = currentFam, parent = currentReq, timeToBuild = 2)
	Building.objects.create(name = 'WvW Fort +5 Karma', shortName = currentFam + '24', family = currentFam, parent = currentReq, timeToBuild = 2)
	currentReq = basics.get(shortName = currentFam + '3')
	Building.objects.create(name = 'WvW Fort +40 Vitality', shortName = currentFam + '31', family = currentFam, parent = currentReq)
	Building.objects.create(name = 'WvW Fort +40 Toughness', shortName = currentFam + '32', family = currentFam, parent = currentReq)
	Building.objects.create(name = 'WvW Fort +40 Power', shortName = currentFam + '33', family = currentFam, parent = currentReq)
	Building.objects.create(name = 'WvW Fort +40 Precision', shortName = currentFam + '34', family = currentFam, parent = currentReq)
	currentReq = basics.get(shortName = currentFam + '4')
	Building.objects.create(name = 'WvW Fort +10% Healing', shortName = currentFam + '41', family = currentFam, parent = currentReq)
	Building.objects.create(name = 'WvW Fort +10% Player Health', shortName = currentFam + '42', family = currentFam, parent = currentReq)
	Building.objects.create(name = 'Guild Catapult', shortName = currentFam + '43', family = currentFam, parent = currentReq, cost = 500)
	currentReq = basics.get(shortName = currentFam + '5')
	Building.objects.create(name = 'WvW Fort +5% Swiftness', shortName = currentFam + '51', family = currentFam, parent = currentReq, cost = 500)
	Building.objects.create(name = 'Guild Siege Suit', shortName = currentFam + '52', family = currentFam, parent = currentReq, cost = 500)
	#Economy
	currentFam = familyIds[2]
	currentReq = basics.get(shortName = currentFam + '1')
	Building.objects.create(name = '+5% Karma from Events for 3 Days', shortName = currentFam + '11', family = currentFam, parent = currentReq)
	Building.objects.create(name = '+5% Exp from Events for 3 Days', shortName = currentFam + '12', family = currentFam, parent = currentReq)
	currentReq = basics.get(shortName = currentFam + '3')
	Building.objects.create(name = '+10% Magic Find for 3 Days', shortName = currentFam + '31', family = currentFam, parent = currentReq)
	Building.objects.create(name = '+10% Gathering Bonus for 3 Days', shortName = currentFam + '32', family = currentFam, parent = currentReq)
	currentReq = basics.get(shortName = currentFam + '4')
	Building.objects.create(name = '+15% Karma from Events for 24 Hours', shortName = currentFam + '41', family = currentFam, parent = currentReq)
	#Architecture
	currentFam = familyIds[3]
	currentReq = basics.get(shortName = currentFam + '1')
	Building.objects.create(name = 'Guild Workshop', shortName = currentFam + '11', family = currentFam, parent = currentReq, isRepetable = False, cost = 500, timeToBuild = 12)
	currentReq = basics.get(shortName = currentFam + '2')
	Building.objects.create(name = 'Guild Vault', shortName = currentFam + '21', family = currentFam, parent = currentReq, isRepetable = False, cost = 1000, timeToBuild = 12)
	currentReq = basics.get(shortName = currentFam + '4')
	Building.objects.create(name = 'Guild Treasure Trove', shortName = currentFam + '41', family = currentFam, parent = currentReq, isRepetable = False, cost = 5000, timeToBuild = 42)
	currentReq = basics.get(shortName = currentFam + '5')
	Building.objects.create(name = 'Deep Cave', shortName = currentFam + '51', family = currentFam, parent = currentReq, isRepetable = False, cost = 5000, timeToBuild = 42)
	
