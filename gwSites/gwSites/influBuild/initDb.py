from gwSites.influBuild.models import Building
#this is just here for translation needs
#from django.utils.translation import ugettext as _

def _(input):
	return input
	
def initDatabase():
	Building.objects.all().delete()
	familyList = ['Politics','Art Of War','Economy', 'Architecture']
	familyIds = ['Pol','Art','Eco','Arc']
	levelCost =  [500,1000,5000,7500,10000]
	levelTime = [16,24,32,96,168]
	for fam in range(0,4):
		prevBuild = None 
		for i in range(1,6):
			b = Building(name = familyList[fam] + ' Level ' + str(i), shortName = familyIds[fam] + str(i), family = familyIds[fam], parent = prevBuild, isRepetable = False, cost = levelCost[i-1], timeToBuild = levelTime[i-1], completeDescr = "Increase your guild's skill in " + familyList[fam] + ' to Level ' + str(i))
			b.save()
			prevBuild = b
	basics = Building.objects.all()
	#Politics
	currentFam = familyIds[0]
	currentReq = basics.get(shortName = currentFam + '1')
	#
	Building.objects.create(name = _('+5% Karma Banner'), shortName = currentFam + '11', family = currentFam, parent = currentReq, cost = 50, timeToBuild = 4, completeDescr = _("Spawns a guild banner that will give +5% karma buff to any ally that touches it for 30 minutes."))
	otherReq = Building.objects.create(name = _('Guild Emblem Template'), shortName = currentFam + '12', family = currentFam, parent = currentReq, cost = 100, isRepetable = False, completeDescr = _("Allows guild members to create a permanent guild emblem design at the Guild Registrar for use on banners and other displays."))
	currentReq = basics.get(shortName = currentFam + '2')
	Building.objects.create(name = _('+5% Influence for 24Hrs.'), shortName = currentFam + '21', family = currentFam, parent = currentReq, cost = 100, timeToBuild = 16, completeDescr = _("Improves guild influence gain in PvE for 24 hours. Stacks with other Influence boosts"))
	Building.objects.create(name = _('Road Marker'), shortName = currentFam + '22', family = currentFam, parent = currentReq, cost = 50, timeToBuild = 4, completeDescr = _("Spawns a road marker that will give 20 secondes of swiftness to any ally that touches it."))	
	Building.objects.create(name = _('Guild Armorer Contract'), shortName = currentFam + '23', family = currentFam, parent = currentReq, isRepetable = False, cost = 500, otherDep = otherReq, completeDescr = _("Allows guild members to purchase armor items that display the guild emblem. Vendors are available in major cities. (Requires Politics - Emblem Template)"))
	currentReq = basics.get(shortName = currentFam + '3')
	Building.objects.create(name = _('Guild Weapons Contract'), shortName = currentFam + '31', family = currentFam, parent = currentReq, isRepetable = False, cost = 1000, timeToBuild = 40, otherDep = otherReq, completeDescr = _("Allows guild members to purchase weapon items that display the guild emblem. Vendors are available in major cities. (Requires Politics - Emblem Template)"))
	Building.objects.create(name = _('Contract Asuran Outsourcing'), shortName = currentFam + '32', family = currentFam, parent = currentReq, timeToBuild = 30, completeDescr = _("A freelance Asuran Lab will help you develop one upgrade without using up one of your work slots."))
	Building.objects.create(name = _('+10% Influence from Events'), shortName = currentFam + '33', family = currentFam, parent = currentReq, completeDescr = _("Hire an event herald to increase the influence your guild earns from doing events for 24 hours."))
	currentReq = basics.get(shortName = currentFam + '4')
	Building.objects.create(name = _('+20% Dungeon Influence for 24 Hrs'), shortName = currentFam + '41', family = currentFam, parent = currentReq, timeToBuild = 36,completeDescr = _("A dungeon survey before beginning will increase dungeon influence reward by 20%. Lasts 24 hours."))
	Building.objects.create(name = _('Guild Banquet'), shortName = currentFam + '42', family = currentFam, parent = currentReq, cost = 1000, timeToBuild = 84, completeDescr = _("Spawns a banquet table, keg, and various other party items which players can eat and drink from. Lasts 1 hour."))
	#Art Of War
	currentFam = familyIds[1]
	currentReq = basics.get(shortName = currentFam + '1')
	Building.objects.create(name = _('+10% PvP Influence for 24 Hours'), shortName = currentFam + '11', family = currentFam, parent = currentReq, cost = 100, completeDescr = _("All influence earned in pvp is increased by 10% for 24 hours."))
	currentReq = basics.get(shortName = currentFam + '2')
	Building.objects.create(name = _('WvW Fort +10% Experience'), shortName = currentFam + '21', family = currentFam, parent = currentReq, timeToBuild = 16, completeDescr = _("For 12 Hrs, any fortification held by your guild in World Vs World will give increased exp to defending allies. Lasts 12 hours."))
	Building.objects.create(name = _('WvW Fort +10% Magic Find'), shortName = currentFam + '22', family = currentFam, parent = currentReq, timeToBuild = 16, completeDescr = _("For 12 Hrs, any fortification held by your guild in World Vs World will give allies a better chance to discover rare loot. Lasts 12 hours."))
	Building.objects.create(name = _('WvW Fort +5 Supply'), shortName = currentFam + '23', family = currentFam, parent = currentReq, timeToBuild = 16, completeDescr = _("For 12 Hrs, any fortification held by your guild in World Vs World will give improved Supply to all allies. Lasts 12 hours."))
	#Building.objects.create(name = _('WvW Fort +5 Karma'), shortName = currentFam + '24', family = currentFam, parent = currentReq, timeToBuild = 2, completeDescr = _("For 12 Hrs, any fortification held by your guild in World Vs World will give karma to defending allies for each kill near the fort. Lasts 12 hours."))
	currentReq = basics.get(shortName = currentFam + '3')
	Building.objects.create(name = _('WvW Fort +40 Vitality'), shortName = currentFam + '31', family = currentFam, parent = currentReq, timeToBuild = 36, completeDescr = _("For 12 Hrs, any fortification held by your guild in World Vs World will give improved Vitality to all allies. Lasts 12 hours."))
	Building.objects.create(name = _('WvW Fort +40 Toughness'), shortName = currentFam + '32', family = currentFam, parent = currentReq, timeToBuild = 36, completeDescr = _("For 12 Hrs, any fortification held by your guild in World Vs World will give improved Toughness to all allies. Lasts 12 hours."))
	Building.objects.create(name = _('WvW Fort +40 Power'), shortName = currentFam + '33', family = currentFam, parent = currentReq, timeToBuild = 36, completeDescr = _("For 12 Hrs, any fortification held by your guild in World Vs World will give improved Power to all allies. Lasts 12 hours."))
	Building.objects.create(name = _('WvW Fort +40 Precision'), shortName = currentFam + '34', family = currentFam, parent = currentReq, timeToBuild = 36, completeDescr = _("For 12 Hrs, any fortification held by your guild in World Vs World will give improved Precision to all allies. Lasts 12 hours."))
	currentReq = basics.get(shortName = currentFam + '4')
	Building.objects.create(name = _('WvW Fort +10% Healing'), shortName = currentFam + '41', family = currentFam, parent = currentReq, completeDescr = _("For 12 Hrs, any fortification held by your guild in World Vs World will give improved Healing to all allies. Lasts 12 hours."))
	Building.objects.create(name = _('WvW Fort +10% Player Health'), shortName = currentFam + '42', family = currentFam, parent = currentReq, completeDescr = _("For 12 Hrs, any fortification held by your guild in World Vs World will give improved Health to all allies. Lasts 12 hours."))
	Building.objects.create(name = _('Guild Catapult'), shortName = currentFam + '43', family = currentFam, parent = currentReq, cost = 500, completeDescr = _("Create a Catapult Siege engine that costs less supply to set up than normal. (requires Foundry from Architecture)"))
	currentReq = basics.get(shortName = currentFam + '5')
	Building.objects.create(name = _('WvW Fort +5% Swiftness'), shortName = currentFam + '51', family = currentFam, parent = currentReq, cost = 500, completeDescr = _("For 12 Hrs, any fortification held by your guild in World Vs World will give improved Swiftness to all allies. Lasts 12 hours."))
	Building.objects.create(name = _('Guild Siege Suit'), shortName = currentFam + '52', family = currentFam, parent = currentReq, cost = 500, timeToBuild = 36, completeDescr = _("Create a Siege Suit that costs less supply to set up than normal. (requires Foundry from Architecture)"))
	#Economy
	currentFam = familyIds[2]
	currentReq = basics.get(shortName = currentFam + '1')
	Building.objects.create(name = _('+5% Exp Public Banner'), shortName = currentFam + '11', family = currentFam, parent = currentReq, cost = 50, timeToBuild = 4, completeDescr = _("Spawns a guild banner that will give +5% exp to any ally that touches it for 30 min. Stacks with other exp buffs."))
	Building.objects.create(name = _('+10% Gathering Bonus Banner'), shortName = currentFam + '12', family = currentFam, parent = currentReq, cost = 50, timeToBuild = 4, completeDescr = _("Spawns a guild banner that will give +10% gathering chance to any ally that touches it for 30 min. Stacks with other exp buffs."))
	#Building.objects.create(name = _('+5% Karma from Events for 3 Days'), shortName = currentFam + '11', family = currentFam, parent = currentReq, completeDescr = _("For 3 days, your guild receives and additional 5% karma from all events."))
	#Building.objects.create(name = _('+5% Exp from Events for 3 Days'), shortName = currentFam + '12', family = currentFam, parent = currentReq, completeDescr = _("Improves guild experience gain by 5% for 3 days."))
	currentReq = basics.get(shortName = currentFam + '2')
	Building.objects.create(name = _('+10% Magic Find Banner'), shortName = currentFam + '21', family = currentFam, parent = currentReq, cost = 50, timeToBuild = 4, completeDescr = _("Spawns a guild banner that will give +10% magic find to any ally that touches it for 30 min. Stacks with other loot buffs."))
	currentReq = basics.get(shortName = currentFam + '3')
	Building.objects.create(name = _('+10% Magic Find for 3 Days'), shortName = currentFam + '31', family = currentFam, parent = currentReq, cost = 500, timeToBuild = 36, completeDescr = _("For 3 days, guild members have 10% better chance to find rare loot. Traveling Antique Shows are great!"))
	Building.objects.create(name = _('+5% Kill exp for 24 Hours'), shortName = currentFam + '32', family = currentFam, parent = currentReq, cost = 500,  completeDescr = _("Imrpove all guild experience gain from kills by 5% for 24h"))
	currentReq = basics.get(shortName = currentFam + '4')
	Building.objects.create(name = _('+15% Karma from Events for 24 Hours'), shortName = currentFam + '41', family = currentFam, parent = currentReq, cost = 500, timeToBuild = 48, completeDescr = _("For 24 hours, your guild receives an additional 15% karma from all events."))
	Building.objects.create(name = _('+10% Gathering Bonus for 48 Hours'), shortName = currentFam + '42', family = currentFam, parent = currentReq, cost = 500, timeToBuild = 32, completeDescr = _("For 48 hours, guild members have 10% better chance to find rare materials from mining, logging, and harvesting."))
	#Architecture
	currentFam = familyIds[3]
	currentReq = basics.get(shortName = currentFam + '1')
	Building.objects.create(name = _('Guild Workshop'), shortName = currentFam + '11', family = currentFam, parent = currentReq, isRepetable = False, cost = 500, timeToBuild = 48, completeDescr = _("The workshop allows an additional upgrade to be building simultaneously."))
	currentReq = basics.get(shortName = currentFam + '2')
	Building.objects.create(name = _('Guild Vault'), shortName = currentFam + '21', family = currentFam, parent = currentReq, isRepetable = False, cost = 1000, timeToBuild = 48, completeDescr = _("Grants access to a 50 slot Guild Vault and gold storage"))
	currentReq = basics.get(shortName = currentFam + '4')
	otherReq = Building.objects.create(name = _('Guild Treasure Trove'), shortName = currentFam + '41', family = currentFam, parent = currentReq, isRepetable = False, cost = 5000, timeToBuild = 168, completeDescr = _("Grants access to a 100 slot Guild Vault"))
	currentReq = basics.get(shortName = currentFam + '5')
	Building.objects.create(name = _('Deep Cave'), shortName = currentFam + '51', family = currentFam, parent = currentReq, otherDep = otherReq, isRepetable = False, cost = 5000, timeToBuild = 168, completeDescr = _("The Deep Cave will expand your treasure trove by another 100 slots."))