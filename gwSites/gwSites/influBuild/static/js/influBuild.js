var iBV = {
	'maxTime': 0,
	'lineTime': [0, 0, 0],
	'currentObj': null,
	'dayCost': [],
	'idInc': 0,
	'cm': false,
	'tc': 25,
	'cpDialog': null,
	'lm': false
	/*'moveInt':null, */
};
/* ****** */
/* object */
/* ****** */
function building(name, parent, otherParent, cost, time, indirectChilds) {
	this.name = name;
	this.parent = parent;
	this.otherParent = otherParent;
	this.cost = cost;
	this.time = time;
	this.indirectChilds = indirectChilds;
	this.endTime = 0;
	this.delStartTime = 0;
	this.myDiv = null;
	this.placedDiv = [];
}

/* ************ */
/* utility bell */
/* ************ */
function getFamily(inputId) {
	var fam;
	for (fam in listBuilds) {
		if (typeof listBuilds[fam][inputId] !== 'undefined') {
			return fam;
		}
	}
}

function extractDisplayId(inputId) {
	return inputId.match(/il\d*(\w+)/)[1];
}

function getItem(inputId, isTop) {
	if (isTop) {
		inputId = extractDisplayId(inputId);
	}
	return listBuilds[getFamily(inputId)][inputId];
}

/* return true only if all other lineTime are smaller
function isTheGreatestLine(index) {
	var retVal = true, i, value = iBV.lineTime[index];
	for (i = 0;i < iBV.lineTime.length;i++) {
		if (i!==index && iBV.lineTime[i]> = value) {
			retVal = false;
		}
	}
	return retVal;
}*/

/*set MaxTime */
function setMaxTime() {
	var i;
	iBV.maxTime = 0;
	for (i = 0; i < iBV.lineTime.length; i++) {
		iBV.maxTime = Math.max(iBV.maxTime, iBV.lineTime[i]);
	}
}

function compareNumbers(a, b) {
	return a - b;
}

function eltIsInArray(jQarray, jQelt) {
	var i, retVal = -1;
	for (i = 0; i < jQarray.length; i++) {
		if (jQarray[i][0].id !== "" && jQarray[i][0].id === jQelt[0].id) {
			retVal = i;
			break;
		}
	}
	return retVal;
}
/* ***** */
/* reset */
/* ***** */
function reset() {
	var fam, build, currentBuild;
	$(".line > div:not(:first-child)").remove();
	iBV.maxTime = 0;
	iBV.lineTime = [0, 0, 0];
	iBV.currentObj = null;
	iBV.dayCost = [];
	iBV.idInc = 0;
	listBuilds.Pol.Pol32.endTimes = [];
	listBuilds.Pol.Pol32.endTimesPos = [];
	for (fam in listBuilds) {
		for (build in listBuilds[fam]) {
			currentBuild = listBuilds[fam][build];
			currentBuild.endTime = 0;
			currentBuild.placedDiv = [];
		}
	}
	$(".cellFam").removeClass("inUse halfSelect inCm").addClass("noSelect");
	$(".colFam:first-child > div:first-child").removeClass("noSelect");
	endDrop($("#buildList1"));
	endDrop($("#buildList2"));
	setDraggable();
}

function resetDataAfterDelete() {
	iBV.maxTime = 0;
	iBV.lineTime = [0, 0, 0];
	iBV.currentObj = null;
	iBV.dayCost = [];
	listBuilds.Pol.Pol32.endTimes = [];
	listBuilds.Pol.Pol32.endTimesPos = [];
	resetDADLine($("#buildList0").children().slice(1), 0);
	resetDADLine($("#buildList1").children().slice(1), 1);
	resetDADAsuranLine();
	setMaxTime();
	addTimeAndCost();
}

function resetDADLine(elts, index) {
	var time = 0, item, currentDay;
	elts.each(function () {
		if (this.id !== "") {
			item = getItem(this.id, true);
			currentDay = Math.floor(time / 6);
			if (typeof iBV.dayCost[currentDay] !== 'undefined') {
				iBV.dayCost[currentDay] += item.cost;
			} else {
				iBV.dayCost[currentDay] = item.cost;
			}
			time += item.time;
			item.endTime = time;
			if (item === listBuilds.Pol.Pol32) {
				item.endTimesPos.push(time);
			}
		} else {
			/*First div of the build line*/
			time += listBuilds.Arc.Arc11.endTime;
			$(this).width(listBuilds.Arc.Arc11.endTime * iBV.tc);
		}
	});
	iBV.lineTime[index] = time;
}

function resetDADAsuranLine() {
	$("#buildList2").children().slice(1).not("[id]").remove();
	var item, currentDay, firstTime,
		elts = $("#buildList2").children(),
		time = 0;
	listBuilds.Pol.Pol32.endTimesPos.sort(compareNumbers);
	elts.each(function () {
		if (this.id !== "") {
			listBuilds.Pol.Pol32.endTimesPos.shift();
			item = getItem(this.id, true);
			currentDay = Math.floor(time / 6);
			if (typeof iBV.dayCost[currentDay] !== 'undefined') {
				iBV.dayCost[currentDay] += item.cost;
			} else {
				iBV.dayCost[currentDay] = item.cost;
			}
			time += item.time;
			item.endTime = time;
			if (item === listBuilds.Pol.Pol32) {
				item.endTimesPos.push(time);
			}
		}
		firstTime = listBuilds.Pol.Pol32.endTimesPos[0];
		if (firstTime > time) {
			$(this).after("<div class='time' style='width:" + (firstTime - time) * iBV.tc + "px;'><span class='styler'>&nbsp;</span></div>");
			time = firstTime;
		}
	});
	iBV.lineTime[2] = time;
	if (listBuilds.Pol.Pol32.endTimesPos.length > 0) {
		initDrop($("#buildList2"));
	} else {
		endDrop($("#buildList2"));
	}
}
/* **** */
/* init */
/* **** */
$(function () {
	initObjects();
	listBuilds.Pol.Pol32.endTimes = [];
	listBuilds.Pol.Pol32.endTimesPos = [];
	$(".cellFam").draggable({
		"revert": true,
		"zIndex": 101,
		"revertDuration": 0,
		"start": function (event, ui) {
			iBV.currentObj = listBuilds[this.parentNode.parentNode.id][this.id];
			$(".enabledList").append("<div class='time" + iBV.currentObj.time + " tempBuild'><span class='styler'>&nbsp;</span></div>");
		},
		"stop": function (event, ui) {
			$(".tempBuild").remove();
		}
	});
	/* Prereq on enter */
	$(".cellFam").on("mouseenter", function () {
		if (!$(this).hasClass("inUse")) {
			highLightRec(getItem($(this)[0].id, false), true);
		}
	});
	$(".cellFam").on("mouseleave", function () {
		if ($(this).hasClass("preReq")) {
			highLightRec(getItem($(this)[0].id, false), false);
		}
	});
	$(".cellFam").on("select", function (event) {
		event.preventDefault();
	});
	setDraggable();
	initDrop($("#buildList0"));

	/* ******** */
	/* deletion */
	/* ******** */
	$(document).on("mouseenter", ".enabledList div[id]", null, function () {
		$(this).append("<div class='delCross'>X</div>");
	});
	$(document).on("mouseleave", ".enabledList div[id]", null, function () {
		$(this).children('.delCross').remove();
	});
	$(document).on("mouseenter", "#buildList2:not(.enabledList) div[id]", null, function () {
		$(this).append("<div class='delCross'>X</div>");
	});
	$(document).on("mouseleave", "#buildList2:not(.enabledList) div[id]", null, function () {
		$(this).children('.delCross').remove();
	});
	$(document).on("mouseenter", ".delCross", null, function () {
		deleteMeAnChildren($(this).parent(), true);
		while (!deleteIncoherentTime()) {}
	});
	$(document).on("mouseleave", ".delCross", null, function () {
		$(".mightDel").removeClass("mightDel");
	});
	$(document).on("click", '.delCross', null, function () {
		$(".mightDel").each(deleteElt);
		setColorFromState();
		setDraggable();
		resetDataAfterDelete();
	});

	$("#reset").on("click", null, reset);
	$("#linkOut").on("click", null, generateLinkOut);
	$("#printOut").on("click", null, generatePrintOut);
	$("#constrMod").on("click", null, function () {
		reset();
		$(this).hide();
		$("#exitCM").show();
		iBV.cm = true;
		$(".cellFam").draggable("disable");
		$(".cellFam:not(.canRepeat)").on("click", function () {
			if ($(this).hasClass("inUse")) {
				disableWhatNeedsToBe($(this)[0].id);
				$(this).addClass("preReq");
			} else {
				enableWhatNeedsToBeRec(listBuilds[this.parentNode.parentNode.id][this.id]);
			}
		});
	});
	$("#exitCM").on("click", null, function () {
		$(this).hide();
		$("#constrMod").show();
		iBV.cm = false;
		setDraggable();
		$(".cellFam:not(.canRepeat)").off("click");
	});
	iBV.cpDialog = $('<div></div>').dialog({
		"autoOpen": false,
		"title": "Here it is",
		"draggable": false,
		"modal": true,
		"resizable": false,
		"width": "auto",
		"height": "auto"
	});
	$("#faqDialog").dialog({
		"autoOpen": false,
		"title": "FAQ",
		"draggable": false,
		"modal": true,
		"resizable": false,
		"width": "90%",
		"height": "auto"
	});
	$("#contactDiv").dialog({
		"autoOpen": false,
		"title": "Contact",
		"draggable": false,
		"modal": true,
		"resizable": false,
		"width": 400,
		"height": 500
	});
	$("#showFAQ").on("click", function () {
		$("#faqDialog").dialog("open");
	});
	$("#contact").on("click", function () {
		$("#thanksDiv").hide();
		$("#formInnerDiv").show();
		$(".errorlist").remove();
		$(".fieldWrapper > :last-child").each(function (elt) {
			this.value = "";
		});
		$("#contactDiv").dialog("open");
	});
	$("#thanksDiv").on("click", function () {
		$("#contactDiv").dialog("close");
	});
	handleContact();
	$('input:button').button();
	$("#bCaccordion").accordion();
	generateLinkIn(window.location.search);
});

/*transforms all the id in parent/otherParent into objects and initialise myDiv*/
function initObjects() {
	var fam, fam2, build, currentBuild;
	for (fam in listBuilds) {
		for (build in listBuilds[fam]) {
			currentBuild = listBuilds[fam][build];
			currentBuild.myDiv = $("#" + build);
			if (currentBuild.parent !== "") {
				currentBuild.parent = listBuilds[fam][currentBuild.parent];
			}
			if (currentBuild.otherParent !== "") {
				currentBuild.otherParent = listBuilds[getFamily(currentBuild.otherParent)][currentBuild.otherParent];
			}
		}
	}
}

/* **** */
/* Drop */
/* **** */
function addObjectOnLine(obj, line, index, isDrop) {
	var currentDay = Math.floor(iBV.lineTime[index] / 6);
	if (typeof iBV.dayCost[currentDay] !== 'undefined') {
		iBV.dayCost[currentDay] += obj.cost;
	} else {
		iBV.dayCost[currentDay] = obj.cost;
	}
	iBV.lineTime[index] += obj.time;
	obj.endTime = iBV.lineTime[index];
	iBV.maxTime = Math.max(iBV.maxTime, iBV.lineTime[index]);
	if (obj.myDiv[0].id === "Arc11") {
		iBV.lineTime[1] = iBV.lineTime[index];
	}
	if (obj.myDiv[0].id === "Pol32") {
		if (listBuilds.Pol.Pol32.endTimesPos.length === 0 && isDrop) {
			initDrop($("#buildList2"));
			if (iBV.lineTime[index] > iBV.lineTime[2]) {
				$("#buildList2").append("<div class='time' style='width:" + (iBV.lineTime[index] - iBV.lineTime[2]) * iBV.tc + "px;'><span class='styler'>&nbsp;</span></div>");
				iBV.lineTime[2] = iBV.lineTime[index];
			}
		}
		listBuilds.Pol.Pol32.endTimesPos.push(iBV.lineTime[index]);
	}
	/* table */
	line.append("<div class='time" + obj.time + "' id='il" + ((obj.myDiv.hasClass("canRepeat") ? ++iBV.idInc : '') + obj.myDiv[0].id) + "'><span class='styler'><span class='text'>" + obj.name + "</span></span></div>");
	obj.placedDiv.push(line.children().last());
}

function initDrop(dropTr) {
	dropTr.addClass("enabledList");
	dropTr.droppable({
		accept : '.cellFam',
		activeClass: "ui-state-hover",
		drop : function (event, ui) {
			var index = parseInt(this.id.substr(-1), 10), i, emptyList, otherP, myFam, currentDay, currentP, time;
			/* watching for order ! */
			currentP = iBV.currentObj.parent;
			if (currentP !== "" && currentP.endTime > iBV.lineTime[index]) {
				alert("I need to be after my parent!");
				return;
			}
			otherP = iBV.currentObj.otherParent;
			if (otherP !== "" && otherP.endTime > iBV.lineTime[index]) {
				alert("I need to be after my parent!");
				return;
			}
			/* storing */
			addObjectOnLine(iBV.currentObj, $(this), index, true);

			addTimeAndCost();
			/*special cases*/
			if (index === 2) {
				listBuilds.Pol.Pol32.endTimesPos.sort(compareNumbers).shift();
				if (listBuilds.Pol.Pol32.endTimesPos.length === 0) {
					endDrop($("#buildList2"));
				} else {
					time = listBuilds.Pol.Pol32.endTimesPos[0];
					if (time > iBV.lineTime[2]) {
						$("#buildList2").append("<div class='time' style='width:" + (time - iBV.lineTime[2]) * iBV.tc + "px;'><span class='styler'>&nbsp;</span></div>");
						iBV.lineTime[2] = time;
					}
				}
			}
			/* bottom */
			enableWhatNeedsToBe(iBV.currentObj);
			iBV.currentObj = null;
		}
	});
}

function endDrop(dropTr) {
	dropTr.removeClass("enabledList");
	dropTr.droppable("destroy");
}
/* ****************** */
/* Bottom part manips */
/* ****************** */
/* to improve? */
function setDraggable() {
	$(".cellFam").draggable("enable");
	$(".noSelect, .inUse:not(.canRepeat)").draggable("disable");
}

function enableWhatNeedsToBe(item) {
	var i, myFam, elt = item.myDiv;
	elt.addClass("inUse");
	if (iBV.cm) {
		elt.addClass("inCm");
		elt.removeClass("preReq");
	}
	if (elt[0].id.length === 4) {
		elt.parent().next().children().first().removeClass("noSelect");
		myFam = elt.parent().parent()[0].id;
		elt.siblings().each(function () {
			var otherP = listBuilds[myFam][this.id].otherParent;
			if (otherP === '' || otherP.myDiv.hasClass("inUse")) {
				$(this).removeClass("noSelect");
			} else {
				$(this).addClass("halfSelect");
			}
		});
	}
	for (i = 0; i < item.indirectChilds.length; i++) {
		if ($('#' + item.indirectChilds[i]).hasClass("halfSelect")) {
			$('#' + item.indirectChilds[i]).removeClass("noSelect halfSelect");
		}
	}
	setDraggable();
	/*special cases*/
	if (elt[0].id === "Arc11") {
		initDrop($("#buildList1"));
		if (!iBV.cm && !iBV.lm) {
			$("#buildList1").append("<div class='time' style='width:" + iBV.lineTime[1] * iBV.tc + "px;'><span class='styler'>&nbsp;</span></div>");
		}
	}
}

function enableWhatNeedsToBeRec(item) {
	enableWhatNeedsToBe(item);
	if (item.parent !== "" && !item.parent.myDiv.hasClass("inUse")) {
		enableWhatNeedsToBeRec(item.parent);
	}
	if (item.otherParent !== "" && !item.otherParent.myDiv.hasClass("inUse")) {
		enableWhatNeedsToBeRec(item.otherParent);
	}
}

function disableWhatNeedsToBe(id) {
	var i, item = listBuilds[getFamily(id)][id];
	if (id === "Arc11") {
		endDrop($("#buildList1"));
		if (!iBV.cm) {
			$("#buildList1").children().eq(1).remove();
			iBV.lineTime[1] = 0;
		}
	}
	if (id.length === 4) {
		item.myDiv.siblings().addClass("noSelect").removeClass("halfSelect inUse inCm");
		item.myDiv.parent().nextAll().children().addClass("noSelect").removeClass("halfSelect inUse inCm");
	}
	for (i = 0; i < item.indirectChilds.length; i++) {
		$('#' + item.indirectChilds[i]).addClass("noSelect").removeClass("inUse inCm");
		/*does he still has a parent in use?*/
		if ($('#' + item.indirectChilds[i]).siblings().first().hasClass("inUse")) {
			$('#' + item.indirectChilds[i]).addClass("halfSelect");
		}
	}
	item.myDiv.removeClass("inUse inCm");
}

function highLightRec(item, isAdd) {
	if (isAdd) {
		item.myDiv.addClass("preReq");
	} else {
		item.myDiv.removeClass("preReq");
	}
	if (item.parent !== "" && (!item.parent.myDiv.hasClass("inUse") || !isAdd)) {
		highLightRec(item.parent, isAdd);
	}
	if (item.otherParent !== "" && (!item.otherParent.myDiv.hasClass("inUse") || !isAdd)) {
		highLightRec(item.otherParent, isAdd);
	}
}

function setColorFromState() {
	$(".cellFam").not(".inCm").each(function () {
		if (getItem(this.id, false).placedDiv.length === 0) {
			disableWhatNeedsToBe(this.id);
		}
	});
}
/* ************* */
/* Cost And Time */
/* ************* */
function addTimeAndCost() {
	var len, emptyList, el2, colsp;
	/* quite subtile... or not. */
	$('.fillBy5 .incompleteDay').remove();
	len = $("#timeLine").children().length - 1;
	emptyList = $();
	el2 = $();
	if (len > Math.floor(iBV.maxTime / 6)) {
		$(".fillBy5").each(function () {
			$(this).children().slice(Math.floor(iBV.maxTime / 6) + 1).remove();
		});
		len = Math.floor(iBV.maxTime / 6);
	}
	while (len < Math.floor(iBV.maxTime / 6)) {
		emptyList = emptyList.add("<div class='time6'><span class='styler'><span class='text'> Day " + (++len) + "</span></span></div>");
		el2 = el2.add("<div class='time6'><span class='styler'></span></div>");
	}
	if (len * 6 < iBV.maxTime) {
		colsp = iBV.maxTime - len * 6;
		emptyList = emptyList.add("<div class='time" + colsp + " incompleteDay'><span class='styler'><span class='text'> D. " + (++len) + "</span></span></div>");
		el2 = el2.add("<div class='time" + colsp + " incompleteDay'><span class='styler'></span></div>");
	}
	$("#timeLine").append(emptyList);
	$("#costPerDay").append(el2);
	$("#totalCost").append(el2.clone());
	adjustCost();
}

function adjustCost() {
	var i, child1, child2, total = 0;
	child1 = $("#costPerDay").children().slice(1).children();
	child2 = $("#totalCost").children().slice(1).children();
	for (i = 0; i < child1.length; i++) {
		if (typeof iBV.dayCost[i] !== 'undefined') {
			total += iBV.dayCost[i];
			child1.eq(i).text(iBV.dayCost[i]);
		} else {
			child1.eq(i).html("&nbsp;");
		}
		child2.eq(i).text(total);
	}
}
/* ******** */
/* deletion */
/* ******** */
function deleteMeAnChildren(eltToDel, delFamily) {
	eltToDel.addClass("mightDel");
	if (eltToDel[0].id !== "") {
		var i, j, child,
			id = extractDisplayId(eltToDel[0].id),
			item = listBuilds[getFamily(id)][id],
			line = $();
		/* special cases first*/
		if (id === "Arc11") {
			$("#buildList1").children().slice(1).each(function () {
				deleteMeAnChildren($(this), true);
			});
		} else if (id === "Pol32") {
			child = $("#buildList2").children("[id]").eq(eltIsInArray(item.placedDiv, eltToDel));
			if (child.length !== 0) {
				deleteMeAnChildren(child, true);
				deleteMeAnChildren(child.prev(), false);
			}
		} else if (!item.myDiv.hasClass("canRepeat")) {
			/* can repeat does not need any treatment*/
			if (id.length === 4 && delFamily) {
				for (i = 0; i < 3; i++) {
					if (iBV.lineTime[i] > 0) {
						line = line.add($("#buildList" + i).children().slice(1));
					}
				}
				/* probably the quickest way for parents */
				line.each(function () {
					if (this.id !== "" && extractDisplayId(this.id).substr(0, 3) === id.substr(0, 3) && extractDisplayId(this.id) > id) {
						/* this is here to be sure to remove indirectChilds as well*/
						deleteMeAnChildren($(this), false);
					}
				});
			}
			/* does not trigger if length = 0. at this point in time, no indirect childs are parents*/
			for (i = 0; i < item.indirectChilds.length; i++) {
				child = getItem(item.indirectChilds[i], false);
				for (j = 0; j < child.placedDiv.length; j++) {
					child.placedDiv[j].addClass("mightDel");
				}
			}
		}
	}
}

function createIncoherentLine(elts) {
	var line = [], time = 0, id, item;
	elts.each(function () {
		if (!$(this).hasClass("mightDel")) {
			if (this.id !== "") {
				if (extractDisplayId(this.id) === "Pol32") {
					item = listBuilds.Pol.Pol32;
					item.endTimes[eltIsInArray(item.placedDiv, $(this))] = time + item.time;
				} else {
					item = getItem(this.id, true);
				}
				item.delStartTime = time;
				/* i'd rather use a lill bit more storage for the time being than to recompute hte link*/
				line.push([item, $(this), time]);
				time += item.time;
			} else {
				/*First div of the build line*/
				time += listBuilds.Arc.Arc11.delStartTime + listBuilds.Arc.Arc11.time;
			}
		}
	});
	return line;
}

function createIncoherentAsuranLine(elts) {
	var line = [], time = 0, id, item;
	elts.each(function (index) {
		if (!$(this).hasClass("mightDel")) {
			if (extractDisplayId(this.id) === "Pol32") {
				item = listBuilds.Pol.Pol32;
				item.endTimes[eltIsInArray(item.placedDiv, $(this))] = time + item.time;
			} else {
				item = getItem(this.id, true);
			}
			item.delStartTime = Math.max(time, listBuilds.Pol.Pol32.endTimes[index]);
			line.push([item, $(this), item.delStartTime]);
			time = item.delStartTime + item.time;
		}
	});
	return line;
}

/* no need if only line1 !*/
function deleteIncoherentTime() {
	var line0, line1 = [], line2 = [], isOk = true, i = 0, j = 0, k = 0, it0, it1, it2, smaller, smallTime, parent, otherP;
	line0 = createIncoherentLine($("#buildList0").children().slice(1));
	if ($("#buildList1").hasClass('enabledList')) {
		line1 = createIncoherentLine($("#buildList1").children().slice(1));
	}
	if ($("#buildList2").children().slice(1).length > 0) {
		line2 = createIncoherentAsuranLine($("#buildList2").children("[id]"));
	}
	while ((i < line0.length || j < line1.length || k < line2.length) && isOk) {
		it0 = (i < line0.length) ? line0[i] : null;
		it1 = (line1.length > 0 && j < line1.length) ? line1[j] : null;
		it2 = (line2.length > 0 && k < line2.length) ? line2[k] : null;
		smaller = it0;
		if (smaller === null) {
			smaller = it1;
		} else if (it1 !== null) {
			smaller = (it0[2] < it1[2]) ? it0 : it1;
		}
		if (smaller === null) {
			smaller = it2;
		} else if (it2 !== null) {
			smaller = (smaller[2] < it2[2]) ? smaller : it2;
		}

		parent = smaller[0].parent;
		otherP = smaller[0].otherParent;
		/* a child can only have its parents in the incoherent lines or constructed thru cm*/
		if (parent !== "" && parent.endTime > 0 && parent.delStartTime + parent.time > smaller[2]) {
			deleteMeAnChildren(smaller[1], true);
			isOk = false;
		} else if (otherP !== "" && otherP.endTime > 0 && otherP.delStartTime + otherP.time > smaller[2]) {
			deleteMeAnChildren(smaller[1], true);
			isOk = false;
		} else {
			switch (smaller) {
			case it0:
				i++;
				break;
			case it1:
				j++;
				break;
			case it2:
				k++;
				break;
			}
		}
	}
	return isOk;
}

function deleteElt() {
	if (this.id !== "") {
		var item = getItem(this.id, true);
		item.endTime = 0;
		item.delStartTime = 0;
		item.placedDiv.splice(eltIsInArray(item.placedDiv, $(this)), 1);
		if (this.id === "Arc11") {
			endDrop($("#buildList1"));
		}
	}
	$(this).remove();
}
/* ******** */
/* transfer */
/* ******** */
function generateLineOut(lineIndex) {
	var retVal = "li" + lineIndex + "=";
	$("#buildList" + lineIndex).children().slice(1).each(function () {
		if (this.id === "") {
			retVal += "s" + $(this).width();
		} else {
			retVal += extractDisplayId(this.id).replace(/\w{3}/, function (string) {return oNs[string]; });
		}
		retVal += ";";
	});
	return retVal + "&";
}

function generateLineIn(inStr, lineIndex) {
	var l, ar, re = /([colts])(\d+)/g, item,
		line = $("#buildList" + lineIndex);
	iBV.lineTime[lineIndex] = 0;
	while ((ar = re.exec(inStr)) !== null) {
		if (ar[1] === "s") {
			iBV.lineTime[lineIndex] += Math.floor(parseInt(ar[2], 10) / iBV.tc);
			line.append("<div class='time' style='width:" + parseInt(ar[2], 10) + "px;'><span class='styler'>&nbsp;</span></div>");
		} else {
			item = getItem(iNs[ar[1]] + ar[2], false);
			addObjectOnLine(item, line, lineIndex, false);
			enableWhatNeedsToBe(item);
			if (lineIndex === 2) {
				listBuilds.Pol.Pol32.endTimesPos.sort().shift();
			}
		}
	}
}

function generateCmOut() {
	var retVal = "cm=", fam, build;
	for (fam in listBuilds) {
		for (build in listBuilds[fam]) {
			if (listBuilds[fam][build].myDiv.hasClass("inCm")) {
				retVal += build.replace(/\w{3}/, function (string) {return oNs[string]; }) + ";";
			}
		}
	}
	return retVal;
}

function generateCmIn(cmList) {
	var ar, re = /([colt])(\d+)/g;
	iBV.cm = true;
	while ((ar = re.exec(cmList)) !== null) {
		enableWhatNeedsToBe(getItem(iNs[ar[1]] + ar[2], false));
	}
	iBV.cm = false;
}

function generateLinkOut() {
	var i, val = "http://" + window.location.host + "/?";
	for (i = 0; i < 3; i++) {
		val += generateLineOut(i);
	}
	val += generateCmOut();
	iBV.cpDialog.html("<a href='" + val + "'>" + val + "</a>");
	iBV.cpDialog.dialog('open');
}

function generateLinkIn(link) {
	var i, re, ar = link.split("&"),
		line = /li(\d)=((\w+;)*)/,
		cm = /cm=((\w+;)*)/;
	iBV.lm = true;
	for (i = 0; i < ar.length; i++) {
		if ((re = line.exec(ar[i])) !== null) {
			if (re[2].length > 0) {
				generateLineIn(re[2], re[1]);
			}
		} else if ((re = cm.exec(ar[i])) !== null) {
			generateCmIn(re[1]);
		}
	}
	addTimeAndCost();
	if (listBuilds.Pol.Pol32.endTimesPos.length > 0) {
		initDrop($("#buildList2"));
	}
	iBV.lm = false;
}
/* ***** */
/* Print */
/* ***** */
function printSort(a, b) {
	return a[1] - b[1];
}

function generatePrintOut() {
	var i, line = [], val = "";
	for (i = 0; i < 3; i++) {
		$("#buildList" + i).children().slice(1).each(function () {
			if (this.id !== "") {
				line.push([getItem(this.id, true), $(this).position().left]);
			}
		});
	}
	line.sort(printSort);
	for (i = 0; i < line.length; i++) {
		val += line[i][0].myDiv.text() + "<br/>";
	}
	iBV.cpDialog.html(val);
	iBV.cpDialog.dialog('open');
}

/* ******* */
/* contact */
/* ******* */
function handleContact() {
	var form = $("#contactForm");
	form.submit(function (e) {
		$("#sendbtn").attr("disabled", true);
		$("#formInnerDiv").load(form.attr("action") + " #formInnerDiv",
			form.serializeArray(),
			function (responseText, responseStatus, xhr) {
				if (responseText.indexOf('class="errorlist"') === -1) {
					$("#thanksDiv").show();
					$("#formInnerDiv").hide();
				}
				/* compter les erreurs.*/
				$("#sendbtn").attr("disabled", false);
			});
		e.preventDefault();
	});
}
