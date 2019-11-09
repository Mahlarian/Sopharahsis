module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Bad Words Filter MOD",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Other Stuff",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	return `${data.text2} | ${data.text}`
},
	
//---------------------------------------------------------------------
// DBM Mods Manager Variables (Optional but nice to have!)
//
// These are variables that DBM Mods Manager uses to show information
// about the mods for people to see in the list.
//---------------------------------------------------------------------

// Who made the mod (If not set, defaults to "DBM Mods")
author: "Jasper",

// The version of the mod (Defaults to 1.0.0)
version: "1.8.9",

// A short description to show on the mod line for this mod (Must be on a single line)
short_description: "Remove the bad words!",

// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function (data, varType) {
	let dataType = 'Text';
	return ([data.varName, dataType]);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["text", "text2", "storage", "varName"],

//---------------------------------------------------------------------
// Command HTML
//
// This function returns a string containing the HTML used for
// editting actions. 
//
// The "isEvent" parameter will be true if this action is being used
// for an event. Due to their nature, events lack certain information, 
// so edit the HTML to reflect this.
//
// The "data" parameter stores constants for select elements to use. 
// Each is an array: index 0 for commands, index 1 for events.
// The names are: sendTargets, members, roles, channels, 
//                messages, servers, variables
//---------------------------------------------------------------------

html: function(isEvent, data) {
	return `
	
	<div style="padding-top: 8px;">
	<p><u>Mod Info:</u><br>
	Made by <b>Jasper</b>!</p>
</div><br>
<div id="Field" style="padding-top: 8px;">
Text To Clean: 
<textarea id="text" rows="3" placeholder="Insert text here..."
style="width: 99%; font-family: monospace; white-space: nowrap;
resize: none;"></textarea>
</div>
<div>
<div id="Field2" style="float: none; padding-top: 8px; width: 35%;">
	Custom Filter:<br>
	<input id="text2" placeholder="Leave Empty For *" class="round" type="text">
</div>

<div style="padding-top: 8px;">
<div id="varNameContainer" style="float: right; width: 60%;">
	Variable Name:<br>
	<input id="varName" class="round" type="text">
</div>
<div style="float: left; width: 35%;">
	Store In:<br>
	<select id="storage" class="round">
		${data.variables[1]}
	</select>
</div>
<div>
</div>
	`
},

//---------------------------------------------------------------------
// Action Editor Init Code
//
// When the HTML is first applied to the action editor, this code
// is also run. This helps add modifications or setup reactionary
// functions for the DOM elements.
//---------------------------------------------------------------------

init: function() {

},

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter, 
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

action: function(cache) {
	const data = cache.actions[cache.index];
	const storage = parseInt(data.storage);
	const varName = this.evalMessage(data.varName, cache);
	const TextToClean = this.evalMessage(data.text, cache);
	const CustomFilter = this.evalMessage(data.text2, cache);
	

	if(!TextToClean) {
		console.log("You do not have any text to filter! Please check your action Bad Words Filter")
	}

	if(!CustomFilter) {
		const Filter = require('bad-words');
		filter = new Filter({ placeHolder: "*"});
		result = filter.clean(TextToClean)
	this.storeValue(result, storage, varName, cache);
	this.callNextAction(cache);}

	else{
		const Filter = require('bad-words');
		const string = "hello, what, is, up"
		ExtraWords = string.split(',')
    	filter = new Filter({ placeHolder: `${CustomFilter}`});
		result = filter.clean(TextToClean)
		this.storeValue(result, storage, varName, cache);
		this.callNextAction(cache);
	}
},

//---------------------------------------------------------------------
// Action Bot Mod
//
// Upon initialization of the bot, this code is run. Using the bot's
// DBM namespace, one can add/modify existing functions if necessary.
// In order to reduce conflictions between mods, be sure to alias
// functions you wish to overwrite.
//---------------------------------------------------------------------

mod: function(DBM) {
}

}; // End of module