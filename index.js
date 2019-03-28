const streamDeckApi = require('stream-deck-api');
const DcsBiosApi = require('dcs-bios-api');
const path = require('path');
const robot = require('robotjs');

const IMAGE_FOLDER = './images/F18C/';

var api = new DcsBiosApi({ logLevel: 'INFO' });
var streamDeck = streamDeckApi.getStreamDeck();
var etat;
api.startListening();

process.on('SIGINT', () => {
  streamDeck.reset();
  api.stopListening();
  process.exit();
});

streamDeck.reset();

var pages = {
  MENU: { 
    1 :{ type : 'image', image :'f18c.png' },
	2 :{ type : 'image', image :'m.png' },
	3 :{ type : 'image', image :'e.png' },
	4 :{ type : 'image', image :'n.png' },
	5 :{ type : 'image', image :'u.png' },
    6: { type: 'page', page: 'LUMIERE', image: 'lumiere.png' },
	
	8: { type: 'ledButton', button: 'MASTER_CAUTION_RESET_SW', led: 'MASTER_CAUTION_LT', upImage: 'mastercautionoff.png', downImage: 'mastercautionon.png' },
    
	10: { type: 'page', page: 'DEM2', image: 'dem2menu.png' },
	11: { type: 'page', page: 'RADAR', image: 'RADAR.png' },
	12: { type: 'page', page: 'INS', image: 'INS.png' },
	13: { type: 'page', page: 'COMBAT', image: 'COMBAT.png' },
	14: { type: 'page', page: 'JETTISON', image: 'JETTISON.png' },
	15: { type: 'page', page: 'DEMARRAGE', image: 'DEMARRAGE.png' }
  },
  
  LUMIERE: {
	 1: { type: 'switch2', button: 'LDG_TAXI_SW', led: 'LDG_TAXI_SW', upImage: 'taxiOff.png', downImage: 'taxiOn.png' },
	 2: { type: 'switch65535', button: 'FORMATION_DIMMER', led: 'FORMATION_DIMMER', upImage: 'hudhautoff.png', downImage: 'hudhauton.png' },
	 3: { type: 'switch65535', button: 'POSITION_DIMMER', led: 'POSITION_DIMMER', upImage: 'ampcdoff.png', downImage: 'ampcdon.png' },
	
	 9: { type: 'page', page: 'DEM2', image: 'dem2menu.png' },
	 13: { type: 'page', page: 'COMBAT', image: 'combatmenu.png' },
	 14: { type: 'page', page: 'DEMARRAGE', image: 'demarragemenu.png' },
	 15: { type: 'page', page: 'MENU', image: 'MENU.png' }
	  
  },
  
  JETTISON: {
	  1: { type: 'switch2', button: 'SJ_LO', led: 'SJ_LO_LT', upImage: 'looff.png', downImage: 'loon.png' },
	  2: { type: 'switch2', button: 'SJ_LI', led: 'SJ_LI_LT', upImage: 'lioff.png', downImage: 'lion.png' },
	  3: { type: 'switch2', button: 'SJ_CTR', led: 'SJ_CTR_LT', upImage: 'ctroff.png', downImage: 'ctron.png' },
	  4: { type: 'switch2', button: 'SJ_RI', led: 'SJ_RI_LT', upImage: 'rioff.png', downImage: 'rion.png' },
	  5: { type: 'switch2', button: 'SJ_RO', led: 'SJ_RO_LT', upImage: 'rooff.png', downImage: 'roon.png' },
	  6: { type: 'SwitchMultiPos0', button: 'SEL_JETT_KNOB', led: 'SEL_JETT_KNOB', upImage: 'LFUSMSLoff.png', downImage: 'LFUSMSLon.png' },
	  7: { type: 'SwitchMultiPos1', button: 'SEL_JETT_KNOB', led: 'SEL_JETT_KNOB', upImage: 'SAFEoff.png', downImage: 'SAFEon.png' },
	  8: { type: 'SwitchMultiPos2', button: 'SEL_JETT_KNOB', led: 'SEL_JETT_KNOB', upImage: 'RFUSMSLoff.png', downImage: 'RFUSMSLon.png' },
	  9: { type: 'SwitchMultiPos3', button: 'SEL_JETT_KNOB', led: 'SEL_JETT_KNOB', upImage: 'RACKLCHRoff.png', downImage: 'RACKLCHRon.png' },
	  10: { type: 'SwitchMultiPos4', button: 'SEL_JETT_KNOB', led: 'SEL_JETT_KNOB', upImage: 'STORESoff.png', downImage: 'STORESon.png' },
	  11: { type: 'ledButton', button: 'SEL_JETT_BTN', led: 'SEL_JETT_BTN', upImage: 'jettoff.png', downImage: 'jetton.png' },
	  12: { type: 'ledButton', button: 'EMER_JETT_BTN', led: 'EMER_JETT_BTN', upImage: 'jettemergoff.png', downImage: 'jettemergon.png' },
	  13: { type: 'page', page: 'COMBAT', image: 'combatmenu.png' },
	  15: { type: 'page', page: 'MENU', image: 'MENU.png' }
	  
	  
	  
  },
  
   DEMARRAGE: {
	  1: { type: 'switch3inv', button: 'BATTERY_SW', led: 'BATTERY_SW', upImage: 'batterieoff.png', downImage: 'batterieon.png' },
	  2: { type: 'switch2led', button: 'APU_CONTROL_SW', led: 'APU_READY_LT', BONLOFFImage: 'APUBONLOFF.png', BOFFLOFFImage: 'APUBOFFLOFF.png',BONLONImage: 'APUBONLON.png', BOFFLONImage: 'APUBOFFLON.png' },
	  3: { type: 'switch3', button: 'ENGINE_CRANK_SW', led: 'ENGINE_CRANK_SW', upImage: 'motgoff.png', downImage: 'motgon.png' },
	  4: { type: 'switch3inv', button: 'ENGINE_CRANK_SW', led: 'ENGINE_CRANK_SW', upImage: 'motdoff.png', downImage: 'motdon.png' },
	  5: { type: 'ledButtonA', button: 'CANOPY_SW', led: 'CANOPY_SW', upImage: 'canopyon.png', downImage: 'canopyoff.png' },
	  6: { type: 'switch2', button: 'OBOGS_SW', led: 'OBOGS_SW', upImage: 'oxyoff.png', downImage: 'oxyon.png' },
	  7: { type: 'ledButton', button: 'TO_TRIM_BTN', led: 'TO_TRIM_BTN', upImage: 'trimoff.png', downImage: 'trimon.png' },
	  8: { type: 'switch65535', button: 'HUD_SYM_BRT', led: 'HUD_SYM_BRT', upImage: 'hudhautoff.png', downImage: 'hudhauton.png' },
	  9: { type: 'switch65535', button: 'AMPCD_BRT_CTL', led: 'AMPCD_BRT_CTL', upImage: 'ampcdoff.png', downImage: 'ampcdon.png' },
	  10: { type: 'switch3', button: 'CMSD_DISPENSE_SW', led: 'CMSD_DISPENSE_SW', upImage: 'dispon.png', downImage: 'dispoff.png' },
	  11: { type: 'ledButton', button: 'FCS_BIT_SW', led: 'FCS_BIT_SW', upImage: 'fcsbitoff.png', downImage: 'fcsbiton.png' },
	  12: { type: 'page', page: 'INS', image: 'insmenu.png' },
	  13: { type: 'ledButton', button: 'FCS_RESET_BTN', led: 'FCS_RESET_BTN', upImage: 'fcsoff.png', downImage: 'fcson.png' },
	  14: { type: 'page', page: 'DEM2', image: 'dem2menu.png' },
	  15: { type: 'page', page: 'MENU', image: 'MENU.png' }
	  
	  
	  
	  
	  
	  
  },
  
   DEM2: {
	   
	   1: { type: 'switch2', button: 'WING_FOLD_PULL', led: 'WING_FOLD_PULL', upImage: 'manaileoff.png', downImage: 'manaileon.png' },
	   3: { type: 'switch2', button: 'ANTI_SKID_SW', led: 'ANTI_SKID_SW', upImage: 'antiskidoff.png', downImage: 'antiskidon.png' },
	   4: { type: 'switch2', button: 'EJECTION_SEAT_ARMED', led: 'EJECTION_SEAT_ARMED', upImage: 'ejecseaton.png', downImage: 'ejecseatoff.png' },
	   5: { type: 'switch2', button: 'HOOK_BYPASS_SW', led: 'HOOK_BYPASS_SW', upImage: 'hookcar.png', downImage: 'hookfield.png' },

	   6: { type: 'switch23', button: 'WING_FOLD_ROTATE', led: 'WING_FOLD_ROTATE', upImage: 'ailehaut.png', middleImage: 'ailemouv.png' , downImage: 'ailebas.png' }, 
	   8: { type: 'switch2', button: 'GEAR_LEVER', led: 'GEAR_LEVER', upImage: 'trainon.png', downImage: 'trainoff.png' },
	   9: { type: 'switch2', button: 'HOOK_LEVER', led: 'HOOK_LEVER', upImage: 'percheatteroon.png', downImage: 'percheatterooff.png' },
	   10: { type: 'switch2', button: 'LAUNCH_BAR_SW', led: 'LAUNCH_BAR_SW', upImage: 'perchecataoff.png', downImage: 'perchecataon.png' },
	   12: { type: 'page', page: 'LUMIERE', image: 'lummenu.png' },
	   
	 //99: { type: 'switch2', button: 'EMERGENCY_PARKING_BRAKE_ROTATE', led: 'EMERGENCY_PARKING_BRAKE_ROTATE', upImage: 'hookcar.png', downImage: 'hookfield.png' },   
	 //99: { type: 'switch2', button: 'EMERGENCY_PARKING_BRAKE_PULL', led: 'EMERGENCY_PARKING_BRAKE_PULL', upImage: 'hookcar.png', downImage: 'hookfield.png' },
	  13: { type: 'page', page: 'COMBAT', image: 'combatmenu.png' },
	  14: { type: 'page', page: 'DEMARRAGE', image: 'demarragemenu.png' },
	  15: { type: 'page', page: 'MENU', image: 'MENU.png' },
	  
  },
  
   RADAR: {
	   
	  1: { type: 'SwitchMultiPos0', button: 'RADAR_SW', led: 'RADAR_SW', upImage: 'offoff.png', downImage: 'offon.png' },
	  2: { type: 'SwitchMultiPos1', button: 'RADAR_SW', led: 'RADAR_SW', upImage: 'stbyoff.png', downImage: 'stbyon.png' },
	  3: { type: 'SwitchMultiPos2', button: 'RADAR_SW', led: 'RADAR_SW', upImage: 'oproff.png', downImage: 'opron.png' },
	  // PAS OP! 4: { type: 'SwitchMultiPos3', button: 'RADAR_SW', led: 'RADAR_SW', upImage: 'pulloff.png', downImage: 'pullon.png' },
	   
	  13: { type: 'page', page: 'COMBAT', image: 'combatmenu.png' },
	  14: { type: 'page', page: 'DEMARRAGE', image: 'demarragemenu.png' },
	  15: { type: 'page', page: 'MENU', image: 'MENU.png' },
	  
  },
  
   INS: {
	   
	  1: { type: 'SwitchMultiPos0', button: 'INS_SW', led: 'INS_SW', upImage: 'offoff.png', downImage: 'offon.png' },
	  2: { type: 'SwitchMultiPos1', button: 'INS_SW', led: 'INS_SW', upImage: 'cvoff.png', downImage: 'cvon.png' },
	  3: { type: 'SwitchMultiPos2', button: 'INS_SW', led: 'INS_SW', upImage: 'gndoff.png', downImage: 'gndon.png' },
	  4: { type: 'SwitchMultiPos3', button: 'INS_SW', led: 'INS_SW', upImage: 'navoff.png', downImage: 'navon.png' },
	  5: { type: 'SwitchMultiPos4', button: 'INS_SW', led: 'INS_SW', upImage: 'ifaoff.png', downImage: 'navon.png' },
	  13: { type: 'page', page: 'COMBAT', image: 'combatmenu.png' },
	  14: { type: 'page', page: 'DEMARRAGE', image: 'demarragemenu.png' },
	  15: { type: 'page', page: 'MENU', image: 'MENU.png' },
	  
  },
  
   COMBAT: {
	   
	   1: { type: 'ledButton', button: 'MASTER_MODE_AA', led: 'MASTER_MODE_AA_LT', upImage: 'aaoff.png', downImage: 'aaon.png' },
	   2: { type: 'switch65535', button: 'HMD_OFF_BRT', led: 'HMD_OFF_BRT', upImage: 'hmdoff.png', downImage: 'hmdon.png' },
	   4: { type: 'switch3inv', button: 'PROBE_SW', led: 'PROBE_SW', upImage: 'percheoff.png', downImage: 'percheon.png' },
	   5: { type: 'switch2', button: 'HUD_ALT_SW', led: 'HUD_ALT_SW', upImage: 'altrdr.png', downImage: 'altbaro.png' },
	   6: { type: 'ledButton', button: 'MASTER_MODE_AG', led: 'MASTER_MODE_AG_LT', upImage: 'agoff.png', downImage: 'agon.png' },
	   8: { type: 'ledButton', button: 'MASTER_CAUTION_RESET_SW', led: 'MASTER_CAUTION_LT', upImage: 'mastercautionoff.png', downImage: 'mastercautionon.png' },
	   10: { type: 'page', page: 'JETTISON', image: 'jetmenu.png' },
	   11: { type: 'switch2', button: 'MASTER_ARM_SW', led: 'MASTER_ARM_SW', upImage: 'masterarmoff.png', downImage: 'masterarmon.png' },
	   12: { type: 'switch3ecm', button: 'ECM_MODE_SW', led: 'ECM_MODE_SW', upImage: 'ecmstby.png', downImage: 'ecmon.png', offImage: 'ecmoff.png' },
	   13: { type: 'switch3inv', button: 'RADAR_SW', led: 'RADAR_SW', upImage: 'radarstby.png', downImage: 'radaron.png' },
	   14: { type: 'switch2', button: 'RWR_POWER_BTN', led: 'RWR_POWER_BTN', upImage: 'rwroff.png', downImage: 'rwron.png' },
       15: { type: 'page', page: 'MENU', image: 'MENU.png' }
	  
  },

};

initializePages(pages);

function initializePages(pages) {
  Object.keys(pages).forEach((pageName) => {
    var page = pages[pageName];

    for (let i = 1; i <= 15; i++) {
      page[i] = page[i] || {};

      var key = page[i];
      key._page = pageName;
      key.number = i;
	  key.etat = 0;
      initializeKey(key);
    }
  });
}

function initializeKey(key) {  
  switch (key.type) {
    case 'ledButton':
      createToggleLedButton(key);
      break;
	case 'ledButtonA':
      createToggleLedButtonA(key);
      break;
	case 'ledButtonB':
      createToggleLedButtonB(key);
      break;
    case 'button':
      createMomentaryButton(key);
      break;
	case 'switch2led':
      createSwitch2ledButton(key);
      break;
	case 'switch2':
      createSwitch2Button(key);
      break;
	  case 'switch23':
      createSwitch23Button(key);
      break;
	 case 'switch65535':
      createSwitch65535Button(key);
      break;
	case 'switch3':
      createSwitch3Button(key);
      break;
	case 'switch3ecm':
      createSwitch3ecmButton(key);
      break;
	case 'switch3inv':
      createSwitch3invButton(key);
      break;
	case 'SwitchMultiPos0':
      createSwitchMultiPos0Button(key);
      break;
	case 'SwitchMultiPos1':
      createSwitchMultiPos1Button(key);
      break;
	case 'SwitchMultiPos2':
      createSwitchMultiPos2Button(key);
      break;
	case 'SwitchMultiPos3':
      createSwitchMultiPos3Button(key);
      break;
	case 'SwitchMultiPos4':
      createSwitchMultiPos4Button(key);
      break;
    case 'page':
      createPageButton(key);
      break;
	case 'image':
      createImageButton(key);
      break;
    case 'pageWithAction':
      createMomentaryPageButton(key.button, key.page, key.upImage, key.downImage, key.number);
      break; 
    case 'custom':
      key.fn();
      break;
  }
}

var currentPage;
displayPage('MENU');

function displayPage(pageName) {
  streamDeck.removeButtonListeners();
  currentPage = pageName;
  var page = pages[pageName];

  Object.keys(page).forEach((keyNumber) => {
    var key = page[keyNumber];
    addKeyListener(key);
    draw(key);
  });
}

function draw(key) {
  if (currentPage != key._page) { return; }

  if (key.currentImage) {
    streamDeck.drawImageFile(key.currentImage, key.number);
  }
  else {
    streamDeck.drawColor(0x000000, key.number);
  }
}

function addKeyListener(key) {
	
	
	
	
  
  if (key.type == 'ledButton') {
    streamDeck.on(`down:${key.number}`, () => {
      api.sendMessage(`${key.button} 1\n`);
    });

    streamDeck.on(`up:${key.number}`, () => {
      api.sendMessage(`${key.button} 0\n`);
    });
  }
  
  if (key.type == 'ledButtonA') {
    streamDeck.on(`down:${key.number}`, () => {
      api.sendMessage(`${key.button} 0\n`);
    });

    streamDeck.on(`up:${key.number}`, () => {
      api.sendMessage(`${key.button} 1\n`);
    });
  }
  
    if (key.type == 'ledButtonB') {
    streamDeck.on(`down:${key.number}`, () => {
      api.sendMessage(`${key.button} 2\n`);
    });

    streamDeck.on(`up:${key.number}`, () => {
      api.sendMessage(`${key.button} 1\n`);
    });
  }
  
  
  else if (key.type == 'switch2led') 
	{
	streamDeck.on(`down:${key.number}`, () => 
	{
		if (key.etat == 1) 
			{
			api.sendMessage(`${key.button} 0\n`);
			} 
		else if (key.etat == 0)
			{
			api.sendMessage(`${key.button} 1\n`);
			}
		});
	}
  
  else if (key.type == 'switch2') 
	{
	streamDeck.on(`down:${key.number}`, () => 
	{
		if (key.etat == 1) 
			{
			api.sendMessage(`${key.button} 0\n`);
			} 
		else if (key.etat == 0)
			{
			api.sendMessage(`${key.button} 1\n`);
			}
		});
	}
	
	else if (key.type == 'switch23') 
	{
	streamDeck.on(`down:${key.number}`, () => 
	{
		if (key.etat == 2) 
			{
			api.sendMessage(`${key.button} 0\n`);
			} 
		else
			{
			api.sendMessage(`${key.button} 2\n`);
			}
		});
	}
	
	else if (key.type == 'switch65535') 
	{
	streamDeck.on(`down:${key.number}`, () => 
	{
		if (key.etat == 65535) 
			{
			api.sendMessage(`${key.button} 0\n`);
			} 
		else 
			{
			api.sendMessage(`${key.button} 65535\n`);
			}
		});
	}
	
	else if (key.type == 'switch3') 
	{
	streamDeck.on(`down:${key.number}`, () => 
	{
		if (key.etat == 0) 
			{
			api.sendMessage(`${key.button} 1\n`);
			} 
		else 
			//if (key.etat == 1)
			{
			api.sendMessage(`${key.button} 0\n`);
			}
		});
	}
	
	else if (key.type == 'switch3ecm') 
	{
	streamDeck.on(`down:${key.number}`, () => 
	{
		if (key.etat == 0) 
			{
			api.sendMessage(`${key.button} 1\n`);
			} 
		else if (key.etat == 1)
			{
			api.sendMessage(`${key.button} 2\n`);
			}
			
		else if (key.etat == 2)
			{
			api.sendMessage(`${key.button} 1\n`);
			}	
		});
	}
	
	else if (key.type == 'switch3inv') 
	{
	streamDeck.on(`down:${key.number}`, () => 
	{
		if (key.etat == 2) 
			{
			api.sendMessage(`${key.button} 1\n`);
			} 
		else 
			//if (key.etat == 1)
			{
			api.sendMessage(`${key.button} 2\n`);
			}
		});
	}
	
	
	else if (key.type == 'SwitchMultiPos0') 
    {
	streamDeck.on(`down:${key.number}`, () => 
	{	
		api.sendMessage(`${key.button} 0\n`);
	});
	}
	
	else if (key.type == 'SwitchMultiPos1')
    {
	streamDeck.on(`down:${key.number}`, () => 
	{	
		api.sendMessage(`${key.button} 1\n`);
	});
	}
	
	else if (key.type == 'SwitchMultiPos2') 
    {
	streamDeck.on(`down:${key.number}`, () => 
	{	
		api.sendMessage(`${key.button} 2\n`);
	});
	}
	
	else if (key.type == 'SwitchMultiPos3') 
    {
	streamDeck.on(`down:${key.number}`, () => 
	{	
		api.sendMessage(`${key.button} 3\n`);
	});
	}
	
	else if (key.type == 'SwitchMultiPos4') 
    {
	streamDeck.on(`down:${key.number}`, () => 
	{	
		api.sendMessage(`${key.button} 4\n`);
	});
	}

  
  else if (key.type == 'button') {
    var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
    var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);

    streamDeck.on(`down:${key.number}`, () => {
      api.sendMessage(`${key.button} 1\n`);
      key.currentImage = downImagePath;
      draw(key);
    });

    streamDeck.on(`up:${key.number}`, () => {
      api.sendMessage(`${key.button} 0\n`);
      key.currentImage = upImagePath;
      draw(key);
    });
  }
  
  else if (key.type == 'page') {
    streamDeck.on(`down:${key.number}`, () => {
      displayPage(key.page);
    });
  }
}

/**
 * Create a button that has a LED in it.
 */
 function createSwitch2ledButton(key) {
  var BONLONImagePath = path.resolve(IMAGE_FOLDER + key.BONLONImage);
  var BONLOFFImagePath = path.resolve(IMAGE_FOLDER + key.BONLOFFImage);
  var BOFFLONImagePath = path.resolve(IMAGE_FOLDER + key.BOFFLONImage);
  var BOFFLOFFImagePath = path.resolve(IMAGE_FOLDER + key.BOFFLOFFImage);

  if (!key.currentImage) {
    key.currentImage = BOFFLOFFImagePath;
  }

  // Draw the key immediately so that we can see it.
  draw(key);

  // Draw the new image when the LED etat changes.
  
  api.on(key.led, (value) => {
    if (value==1)
		{
		if (key.etat==1)
			{
			key.currentImage = BONLONImagePath
			draw(key);
			}
		if (key.etat==0)
			{
			key.currentImage = BOFFLONImagePath
			draw(key);
			} 
		
		
		}
	if (value==0)
		{
		if (key.etat==1)
			{
			key.currentImage = BONLOFFImagePath
			draw(key);
			}
		if (key.etat==0)
			{
			key.currentImage = BOFFLOFFImagePath
			draw(key);
			}
		}
		
		  
    
  })
  
    api.on(key.button, (value) => {
    if (value==1)
		{
		if (key.etatled==1)
			{
			key.currentImage = BONLONImagePath
			draw(key);
			}
		if (key.etatled==0)
			{
			key.currentImage = BONLOFFImagePath
			draw(key);
			} 
		
		
		}
	if (value==0)
		{
		if (key.etatled==1)
			{
			key.currentImage = BOFFLONImagePath
			draw(key);
			}
		if (key.etatled==0)
			{
			key.currentImage = BOFFLOFFImagePath
			draw(key);
			}
		}
		
		  
    
  })
	
	// Draw the new etat when the etat etat changes.
  api.on(key.button, (value) => {
	key.etat = value;
  });
  
  api.on(key.led, (value) => {
	key.etatled = value;
  });
  
}
 
function createSwitch2Button(key) {
  var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
  var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);

  if (!key.currentImage) {
    key.currentImage = upImagePath;
  }

  // Draw the key immediately so that we can see it.
  draw(key);

  // Draw the new image when the LED etat changes.
  api.on(key.led, (value) => {
    key.currentImage = value ? downImagePath : upImagePath;
	//key.etat = value;
    draw(key);
  })
	
	// Draw the new etat when the etat etat changes.
  api.on(key.button, (value) => {
	key.etat = value;
  });
}

function createSwitch23Button(key) {
  var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
  var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);
  var middleImagePath = path.resolve(IMAGE_FOLDER + key.middleImage);
  if (!key.currentImage) {
    key.currentImage = upImagePath;
  }

  // Draw the key immediately so that we can see it.
  draw(key);

  // Draw the new image when the LED etat changes.
  api.on(key.button, (value) => {
    if (value==0)
		{
		key.currentImage = upImagePath
		draw(key);
		} 
	else if (value==2)
		{
		key.currentImage = downImagePath
		draw(key);
		} 
				
	
  })
	
	// Draw the new etat when the etat etat changes.
  api.on(key.button, (value) => {
	key.etat = value;
  });
}

function createSwitch65535Button(key) {
  var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
  var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);

  if (!key.currentImage) {
    key.currentImage = upImagePath;
  }

  // Draw the key immediately so that we can see it.
  draw(key);

  // Draw the new image when the LED etat changes.
  api.on(key.led, (value) => {
    key.currentImage = value ? downImagePath : upImagePath;
	//key.etat = value;
    draw(key);
  })
	
	// Draw the new etat when the etat etat changes.
  api.on(key.button, (value) => {
	key.etat = value;
  });
}

function createSwitch3Button(key) {
  var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
  var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);

  if (!key.currentImage) {
    key.currentImage = upImagePath;
  }

  // Draw the key immediately so that we can see it.
  draw(key);

  // Draw the new image when the LED etat changes.
  api.on(key.led, (value) => {
    if (value==0)
		{
		key.currentImage = downImagePath
		}
	  else
		{
		key.currentImage = upImagePath
		}  
		  
    draw(key);
  })
	
	// Draw the new etat when the etat etat changes.
  api.on(key.button, (value) => {
	key.etat = value;
  });
}

function createSwitch3ecmButton(key) {
  var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
  var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);
  var offImagePath = path.resolve(IMAGE_FOLDER + key.offImage);
  if (!key.currentImage) {
    key.currentImage = upImagePath;
  }

  // Draw the key immediately so that we can see it.
  draw(key);

  // Draw the new image when the LED etat changes.
  api.on(key.led, (value) => {
    if (value==0)
		{
		key.currentImage = offImagePath
		}
	  else if (value==1)
		{
		key.currentImage = upImagePath
		}  
		else if (value==2)
		{
		key.currentImage = downImagePath
		} 
		  
    draw(key);
  })
	
	// Draw the new etat when the etat etat changes.
  api.on(key.button, (value) => {
	key.etat = value;
  });
}

function createSwitch3invButton(key) {
  var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
  var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);

  if (!key.currentImage) {
    key.currentImage = upImagePath;
  }

  // Draw the key immediately so that we can see it.
  draw(key);

  // Draw the new image when the LED etat changes.
  api.on(key.led, (value) => {
    if (value==2)
		{
		key.currentImage = downImagePath
		}
	  else
		{
		key.currentImage = upImagePath
		}  
		  
    draw(key);
  })
	
	// Draw the new etat when the etat etat changes.
  api.on(key.button, (value) => {
	key.etat = value;
  });
}



function createSwitchMultiPos0Button(key) {
  var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
  var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);

  if (!key.currentImage) {
    key.currentImage = upImagePath;
  }

  // Draw the key immediately so that we can see it.
  draw(key);

  // Draw the new image when the LED etat changes.
  api.on(key.led, (value) => {
	  if (value==0)
		{
		key.currentImage = downImagePath
		}
	  else
		{
		key.currentImage = upImagePath
		}  
		  
    draw(key);
  })
	
	// Draw the new etat when the etat etat changes.
  api.on(key.button, (value) => {
	key.etat = value;
  });
}

function createSwitchMultiPos1Button(key) {
  var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
  var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);

  if (!key.currentImage) {
    key.currentImage = upImagePath;
  }

  // Draw the key immediately so that we can see it.
  draw(key);

  // Draw the new image when the LED etat changes.
  api.on(key.led, (value) => {
	  if (value==1)
		{
		key.currentImage = downImagePath
		}
	  else
		{
		key.currentImage = upImagePath
		}
    draw(key);
  })
	
	// Draw the new etat when the etat etat changes.
  api.on(key.button, (value) => {
	key.etat = value;
  });
}

function createSwitchMultiPos2Button(key) {
  var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
  var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);

  if (!key.currentImage) {
    key.currentImage = upImagePath;
  }

  // Draw the key immediately so that we can see it.
  draw(key);

  // Draw the new image when the LED etat changes.
  api.on(key.led, (value) => {
	  if (value==2)
		{
		key.currentImage = downImagePath
		}
	  else
		{
		key.currentImage = upImagePath
		}
    draw(key);
  })
	
	// Draw the new etat when the etat etat changes.
  api.on(key.button, (value) => {
	key.etat = value;
  });
}

function createSwitchMultiPos3Button(key) {
  var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
  var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);

  if (!key.currentImage) {
    key.currentImage = upImagePath;
  }

  // Draw the key immediately so that we can see it.
  draw(key);

  // Draw the new image when the LED etat changes.
  api.on(key.led, (value) => {
	  if (value==3)
		{
		key.currentImage = downImagePath
		}
	  else
		{
		key.currentImage = upImagePath
		}
    draw(key);
  })
	
	// Draw the new etat when the etat etat changes.
  api.on(key.button, (value) => {
	key.etat = value;
  });
}

function createSwitchMultiPos4Button(key) {
  var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
  var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);

  if (!key.currentImage) {
    key.currentImage = upImagePath;
  }

  // Draw the key immediately so that we can see it.
  draw(key);

  // Draw the new image when the LED etat changes.
  api.on(key.led, (value) => {
	  if (value==4)
		{
		key.currentImage = downImagePath
		}
	  else
		{
		key.currentImage = upImagePath
		}
    draw(key);
  })
	
	// Draw the new etat when the etat etat changes.
  api.on(key.button, (value) => {
	key.etat = value;
  });
}

function createToggleLedButton(key) {
  var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
  var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);

  if (!key.currentImage) {
    key.currentImage = upImagePath;
  }

  // Draw the key immediately so that we can see it.
  draw(key);

  // Draw the new image when the LED etat changes.
  api.on(key.led, (value) => {
    key.currentImage = value ? downImagePath : upImagePath;
    draw(key);
  });
}

function createToggleLedButtonA(key) {
  var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
  var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);

  if (!key.currentImage) {
    key.currentImage = upImagePath;
  }

  // Draw the key immediately so that we can see it.
  draw(key);

  // Draw the new image when the LED etat changes.
  api.on(key.led, (value) => {
    key.currentImage = value ? downImagePath : upImagePath;
    draw(key);
  });
}

function createToggleLedButtonB(key) {
  var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
  var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);

  if (!key.currentImage) {
    key.currentImage = upImagePath;
  }

  // Draw the key immediately so that we can see it.
  draw(key);

  // Draw the new image when the LED etat changes.
  api.on(key.led, (value) => {
    key.currentImage = value ? downImagePath : upImagePath;
    draw(key);
  });
}



/**
 * Create a button that navigates to another page.
 */
function createPageButton(key) {
  var imagePath = path.join(IMAGE_FOLDER, key.image);
  key.currentImage = imagePath;

  draw(key);
  addKeyListener(key);
}

function createImageButton(key) {
  var imagePath = path.join(IMAGE_FOLDER, key.image);
  key.currentImage = imagePath;
}
/**
 * Create a momentary button that will switch images when it is pressed and released.
 */
function createMomentaryButton(key) {
  var upImagePath = path.resolve(IMAGE_FOLDER + key.upImage);
  var downImagePath = path.resolve(IMAGE_FOLDER + key.downImage);
  key.currentImage = upImagePath;
  draw(key);
  addKeyListener(key);
}


function createMomentaryPageButton(buttonIdentifier, page, upImage, downImage, buttonNumber) {
  createMomentaryButton(buttonIdentifier, upImage, downImage, buttonNumber);

  streamDeck.on(`up:${buttonNumber}`, () => {
    displayPage(pages[page]);
  });
}

function createPviSelectedWaypointIndicator(buttonNumber) {
  var drawImageFile = (value, imageName) => {
    if (value) {
      streamDeck.drawImageFile(path.resolve(IMAGE_FOLDER + imageName), buttonNumber);
    }
    else if (!value && currentSelection == imageName) {
      streamDeck.drawColor(0x000000, buttonNumber);
      currentSelection = undefined;
    }
    else {
      currentSelection = imageName;
    }
  };

  var currentSelection;

  if (api.getControlValue('Ka-50', 'PVI-800 Control Panel', 'PVI_WAYPOINTS_LED')) {
    drawImageFile(buttonNumber, 'btnWPT-on.png');
    currentSelection = 'btnWPT-on.png';
  }
  else if (api.getControlValue('Ka-50', 'PVI-800 Control Panel', 'PVI_AIRFIELDS_LED')) {
    drawImageFile(buttonNumber, 'btnAIR-on.png');
    currentSelection = 'btnAIR-on.png';
  }
  else if (api.getControlValue('Ka-50', 'PVI-800 Control Panel', 'PVI_FIXPOINTS_LED')) {
    drawImageFile(buttonNumber, 'btnFIX-on.png');
    currentSelection = 'btnFIX-on.png';
  }
  else if (api.getControlValue('Ka-50', 'PVI-800 Control Panel', 'PVI_TARGETS_LED')) {
    drawImageFile(buttonNumber, 'btnNAV-on.png');
    currentSelection = 'btnNAV-on.png';
  }

  api.on('PVI_WAYPOINTS_LED', (value) => {
    drawImageFile(value, 'btnWPT-on.png');
  });

  api.on('PVI_AIRFIELDS_LED', (value) => {
    drawImageFile(value, 'btnAIR-on.png');
  });

  api.on('PVI_FIXPOINTS_LED', (value) => {
    drawImageFile(value, 'btnFIX-on.png');
  });

  api.on('PVI_TARGETS_LED', (value) => {
    drawImageFile(value, 'btnNAV-on.png');
  });
}