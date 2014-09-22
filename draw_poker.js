// Global Variables
var score = 100;
var dealt = false;
var hand = new Array(6);
var held = new Array(6);
var deck = new Array(53);

//Definition for the Card Object
// Make a filename for an image, given Card Object
function fname() {
	return this.num + this.suit + ".gif";
}

//Constructor for Card Objects
function Card(num, suit) {
	this.num = num;
	this.suit = suit;
	this.fname = fname;
}

//Shuffle and then Deal the cards
function Deal() {
	//fill the deck in order
	for (i = 1; i < 14; i++) {
	deck[i] = new Card(i,"c");
	deck[i+13] = new Card(i,"h");
	deck[i+26] = new Card(i,"s");
	deck[i+39] = new Card(i,"d");
}
	//shuffle the deck
	var n = Math.floor(400 * Math.random() + 500);
	for (i=1; i<n; i++) {
		card1 = Math.floor(52*Math.random() + 1);
		card2 = Math.floor(52*Math.random() + 1);
		temp = deck[card2];
		deck[card2] = deck[card1];
		deck[card1] = temp;
	}

	//Deal and Display cards
	for (i=1; i<6; i++) {
		hand[i] = deck[i];
		document.images[i].src = hand[i].fname();
		document.images[i+5].src = "hold.gif";
		held[i] = false;
	}
	dealt = true;
	score = score - 1; //deduct one for bet amount
	document.form1.total.value = score;
	document.images[11].src="draw.gif";
	Addscore();
}

//Deal or Draw
function DealDraw() {
	if (dealt == true) {
		Draw();
	} else {
		Deal();
	}
}

//Hold or Discard a card
function Hold(num) {
	if (!dealt) return;
	if (!held[num]) {
		held[num] = true;
		document.images[5+num].src="hold2.gif";
	}
	else {
		held[num] = false;
		document.images[5+num].src="hold.gif";
	}
}

//Draw new cards
function Draw() {
	var curcard = 6;
	for (i=1; i<6; i++) {
		if (!held[i]) {
			hand[i] = deck[curcard++];
			document.images[i].src = hand[i].fname();
		}
	}
	dealt = false;
	document.images[11].src="deal.gif";
	score += Addscore();
	document.form1.total.value = score;
}
//Numeric sort function
function Numsort(a,b) {return a - b;}
//Calculate Score
function Addscore() {
	var straight = false;
	var flush = false;
	var pairs = 0;
	var set = false;
	var tally = new Array(14);
//sorted array for convenience
	var nums = new Array(5);
	for (i=0; i<5; i++) {
		nums[i] = hand[i+1].num;
	}
	nums.sort(Numsort);
	//flush
	if (hand[1].suit == hand[2].suit &&
		hand[2].suit == hand[3].suit &&
		hand[3].suit == hand[4].suit &&
		hand[4].suit == hand[5].suit) flush = true;
	//straight (Ace low)
	if (nums[0] == nums[1] -1 &&
		nums[1] == nums[2] -1 &&
		nums[2] == nums[3] -1 &&
		nums[3] == nums[4] -1) straight = true;
	//straight (Ace high)
	if (nums[0] == 1 &&
		nums[1] == 10 &&
		nums[2] == 11 &&
		nums[3] == 12 &&
		nums[4] == 13) straight = true;
	//royal flush, straight flush, straight, flush
	if (straight &&
		flush &&
		nums[4] == 13 &&
		nums[0] == 1)
	{
		document.form1.message.value="Straight Flush!!!";
		return 50;
	}
	if (straight) {
		document.form1.message.value="Straight!!!";
		return 4;
	}
	if (flush) {
		document.form1.message.value="Flush!!!";
		return 5;
	}
	//tally array is a count for each card value
	for (i=1; i<14; i++) {
		tally[i] = 0;
	}
	for (i=0; i<5; i++) {
		tally[nums[i]] += 1;
	}
	for (i=1; i<14; i++) {
		if (tally[i] == 4) {
			document.form1.message.value = "Four of a Kind!!!";
			return 25;
		}
		if (tally[i] == 3) set = true;
		if (tally[i] == 2) pairs += 1;
	}
	if (set && pairs == 1) {
		document.form1.message.value = "Full House!!!";
		return 10;
	}
	if (pairs == 2) {
		document.form1.message.value = "Two Pair!!!";
		return 2;
	}
	if (set) {
		document.form1.message.value = "Three of a Kind!!!";
		return 3;
	}
	if (pairs == 1) {
		if (tally[1] == 2 || tally[11] == 2 ||
			tally[12] == 2 || tally[13] == 2) {
			document.form1.message.value = "Jacks or Better!!";
			return 1;
		}
	}
	document.form1.message.value = "No Score";
	return 0;
}