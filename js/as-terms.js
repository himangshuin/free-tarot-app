/* Assamese dictionary, part 1: card names, suits, signs, planets, colours, keywords, ratings. */
window.TAROT_AS={P:{},TERMS:{},PAT:[]};
(function(){
var A=window.TAROT_AS,T=A.TERMS,P=A.P;
function add(o,t){for(var k in o)(t||T)[k]=o[k]}

/* Major Arcana */
add({'The Fool':'মূৰ্খ','The Magician':'যাদুকৰ','The High Priestess':'মহাপূজাৰিণী','The Empress':'সম্ৰাজ্ঞী','The Emperor':'সম্ৰাট',
'The Hierophant':'ধৰ্মগুৰু','The Lovers':'প্ৰেমিক-প্ৰেমিকা','The Chariot':'ৰথ','Strength':'শক্তি','The Hermit':'সন্ন্যাসী',
'Wheel of Fortune':'ভাগ্যচক্ৰ','Justice':'ন্যায়','The Hanged Man':'ওলমি থকা মানুহ','Death':'মৃত্যু','Temperance':'সংযম','The Devil':'শয়তান',
'The Tower':'মিনাৰ','The Star':'তৰা','The Moon':'জোন','The Sun':'সূৰ্য','Judgement':'চূড়ান্ত বিচাৰ','The World':'বিশ্ব'});

/* Minor Arcana: "Two of Cups" -> "কাপছৰ দুই" */
var SU={Wands:['ৱাণ্ডছ','ৱাণ্ডছৰ'],Cups:['কাপছ','কাপছৰ'],Swords:['সোৰ্ডছ','সোৰ্ডছৰ'],Pentacles:['পেণ্টাক্লছ','পেণ্টাক্লছৰ']};
var RK={Ace:'এইচ',Two:'দুই',Three:'তিনি',Four:'চাৰি',Five:'পাঁচ',Six:'ছয়',Seven:'সাত',Eight:'আঠ',Nine:'ন',Ten:'দহ',Page:'পেজ',Knight:'নাইট',Queen:'ৰাণী',King:'ৰজা'};
for(var s in SU){T[s]=SU[s][0];for(var r in RK)T[r+' of '+s]=SU[s][1]+' '+RK[r]}
['Ace','Page','Knight','Queen','King'].forEach(function(r){T[r]=RK[r]});
A.RK=RK;

add({'Aries':'মেষ','Taurus':'বৃষ','Gemini':'মিথুন','Cancer':'কৰ্কট','Leo':'সিংহ','Virgo':'কন্যা','Libra':'তুলা','Scorpio':'বৃশ্চিক','Sagittarius':'ধনু','Capricorn':'মকৰ','Aquarius':'কুম্ভ','Pisces':'মীন',
'Sun':'সূৰ্য','Moon':'চন্দ্ৰ','Mars':'মঙ্গল','Mercury':'বুধ','Jupiter':'বৃহস্পতি','Venus':'শুক্ৰ','Saturn':'শনি','Rahu':'ৰাহু','Ketu':'কেতু','Uranus':'ইউৰেনাছ','Neptune':'নেপচুন','Pluto':'প্লুটো',
'Fire':'অগ্নি','Water':'জল','Air':'বায়ু','Earth':'পৃথিৱী','FIRE':'অগ্নি','WATER':'জল','AIR':'বায়ু','EARTH':'পৃথিৱী',
'Yellow':'হালধীয়া','Red':'ৰঙা','Brown':'মটিয়া','Orange':'কমলা','Green':'সেউজীয়া','Blue':'নীলা','Violet':'বেঙুনীয়া','Purple':'বেঙুনীয়া','Black':'ক\'লা','White':'বগা','Gray':'ধূসৰ','Pink':'গুলপীয়া','Golden':'সোণালী','Saffron':'জাফৰানী','Ochre':'গেৰুৱা','Cream':'ক্ৰীম','Aquamarine':'অ্যাকুৱামেৰিন',
'Deep yellow (mustard)':'গাঢ় হালধীয়া (সৰিয়হ)','Pale Yellow, Cream':'পাতল হালধীয়া, ক্ৰীম','Bright Yellow':'উজ্জ্বল হালধীয়া','Dark Blue':'গাঢ় নীলা','Slate Gray':'ধূসৰ-নীলা',
/* gems and crystals */
'Ruby':'পদ্মৰাগ (ৰুবি)','Pearl':'মুকুতা','Coral':'প্ৰৱাল','Red Coral':'ৰঙা প্ৰৱাল','White Coral':'বগা প্ৰৱাল','Emerald':'পান্না','Topaz':'পোখৰাজ','Diamond':'হীৰা','Sapphire':'নীলম','Yellow Sapphire':'হালধীয়া নীলম','Blue Sapphire':'নীলা নীলম',
'Moonstone':'চন্দ্ৰকান্ত','Garnet':'গাৰ্নেট','Opal':'অপাল','Hessonite':'গোমেদ','Gomedh':'গোমেদ','Onyx':'অনিক্স','Amber':'অম্বৰ','Cat’s Eye':'বৈদূৰ্য (কেট\'ছ আই)',
'Amethyst':'অ্যামেথিষ্ট','Agate':'আগেট','Carnelian':'কাৰ্নেলিয়ান','Citrine':'চিট্ৰিন','Clear Quartz':'স্ফটিক (কোৱাৰ্টজ)','Rose Quartz':'গোলাপী কোৱাৰ্টজ','Lapis Lazuli':'লাপিছ লাজুলি','Peridot':'পেৰিডট','Pyrite':'পাইৰাইট','Red Jasper':'ৰঙা জেস্পাৰ','Sodalite':'সোডালাইট','Turquoise':'ফিৰোজা','Tourmaline':'টৰমেলাইন','Labradorite':'লেব্ৰাডোৰাইট',
/* ranks of the numbers in sentences */
'Major Arcana':'মেজৰ আৰ্কানা','Minor Arcana':'মাইনৰ আৰ্কানা'});

/* months, weekdays: exact phrases only (May / March are also English words) */
add({'January':'জানুৱাৰী','February':'ফেব্ৰুৱাৰী','March':'মাৰ্চ','April':'এপ্ৰিল','May':'মে\'','June':'জুন','July':'জুলাই','August':'আগষ্ট','September':'ছেপ্টেম্বৰ','October':'অক্টোবৰ','November':'নৱেম্বৰ','December':'ডিচেম্বৰ',
'Jan':'জানু','Feb':'ফেব্ৰু','Mar':'মাৰ্চ','Apr':'এপ্ৰি','Jun':'জুন','Jul':'জুলাই','Aug':'আগ','Sep':'ছেপ্টে','Oct':'অক্টো','Nov':'নৱে','Dec':'ডিচে','Year':'বছৰ',
'Sunday':'দেওবাৰ','Monday':'সোমবাৰ','Tuesday':'মঙ্গলবাৰ','Wednesday':'বুধবাৰ','Thursday':'বৃহস্পতিবাৰ','Friday':'শুক্ৰবাৰ','Saturday':'শনিবাৰ'},P);
A.MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];

/* archetypes (Major Arcana) */
add({'The Child':'শিশু','The Creator, the Master':'সৃষ্টিকৰ্তা, গুৰু','The Queen of Heaven':'স্বৰ্গৰ ৰাণী','The Mother, The Nurturer':'মাতৃ, পালনকৰ্ত্ৰী','The Father':'পিতৃ','The Saint':'সাধু',
'The Crossroads':'চৌমাথা','The Departure':'যাত্ৰাৰম্ভ','Taming the Animal':'পশুত্বক বশ কৰা','The Wise old man':'জ্ঞানী বৃদ্ধ','The Calling':'আহ্বান','Intelligence':'বুদ্ধিমত্তা','The Test':'পৰীক্ষা',
'The Soul Guide':'আত্মাৰ পথপ্ৰদৰ্শক','The Adversary':'প্ৰতিপক্ষ','The Liberation':'মুক্তি','Wisdom':'প্ৰজ্ঞা','The Night, Daybreak':'ৰাতি, ভোৰ','The Day, the Rosy Dawn':'দিন, ৰঙীন ভোৰ','The World of Transformation':'ৰূপান্তৰৰ জগত','Paradise regained':'পুনৰুদ্ধাৰ হোৱা স্বৰ্গ'},P);

/* keywords on the card pages */
add({'Beginnings':'আৰম্ভণি','Originality':'মৌলিকতা','Spirituality':'আধ্যাত্মিকতা','Eccentricity':'অদ্ভুতালি','Unconventional':'অপ্ৰচলিত','Folly':'নিৰ্বুদ্ধিতা','Initiative':'উদ্যোগ','Skill':'দক্ষতা','Activity':'কৰ্মতৎপৰতা','Cleverness':'চতুৰতা','Contructive Power':'সৃষ্টিশীল শক্তি',
'Secrecy':'গোপনীয়তা','Intuition':'অন্তৰ্জ্ঞান','Delays':'পলম','Spiritual Knowledge':'আধ্যাত্মিক জ্ঞান','Deep Issues':'গভীৰ বিষয়','Things Hidden':'লুকাই থকা কথা','Fertility':'উৰ্বৰতা','Abundance':'প্ৰাচুৰ্য','Sensuality':'ইন্দ্ৰিয়সুখ','Nurturing':'লালন-পালন','Happiness':'সুখ','Fruitfulness':'ফলপ্ৰসূতা',
'Stability':'স্থিৰতা','Power':'ক্ষমতা','Authority':'কৰ্তৃত্ব','Discipline':'অনুশাসন','Boundaries':'সীমা','Organised Religion':'সংগঠিত ধৰ্ম','Test Of Life':'জীৱনৰ পৰীক্ষা','Knowledge':'জ্ঞান','Dogmatism':'গোড়ামি','Revelation':'প্ৰকাশ',
'Love':'প্ৰেম','Personal Relationships':'ব্যক্তিগত সম্পৰ্ক','Choice Between Heart & Mind':'হৃদয় আৰু মনৰ মাজত বাছনি','Selfless Union':'নিঃস্বাৰ্থ মিলন','Marriage':'বিবাহ','Inspiration':'অনুপ্ৰেৰণা','Travel':'ভ্ৰমণ','Movement':'গতি','Ambition':'উচ্চাকাংক্ষা',
'Balance':'ভাৰসাম্য','Self-Assertion':'আত্মপ্ৰতিষ্ঠা','Self Control':'আত্মসংযম','Fortitude':'ধৈৰ্য্য আৰু সাহস','Spiritual Strength':'আধ্যাত্মিক শক্তি','Patience':'ধৈৰ্য্য','Self Mastery':'আত্মনিয়ন্ত্ৰণ','Isolation':'নিৰ্জনতা','Deep Study':'গভীৰ অধ্যয়ন','Introspection':'আত্মবিশ্লেষণ',
'Inner Counsel':'অন্তৰৰ পৰামৰ্শ','Celibacy':'ব্ৰহ্মচৰ্য','Unexpected Turn':'অপ্ৰত্যাশিত মোৰ','Expansion':'প্ৰসাৰণ','New Horizons':'নতুন দিগন্ত','Dame Fortune':'ভাগ্যদেৱী','A Change':'পৰিৱৰ্তন','Cycles Of Life':'জীৱনৰ চক্ৰ','Legal Affairs':'আইনী বিষয়','Karmic Balance':'কৰ্মৰ ভাৰসাম্য',
'Cause And Effect Laws':'কাৰণ-ফলৰ নিয়ম','Decision':'সিদ্ধান্ত','Judgement ':'বিচাৰ','Act of Sacrifice':'ত্যাগৰ কৰ্ম','Unconventional Behaviour':'অপ্ৰচলিত আচৰণ','Surrender':'সমৰ্পণ','Flexible Thinking':'নমনীয় চিন্তা','Transformation':'ৰূপান্তৰ','Ending':'সমাপ্তি','a New Beginning':'নতুন আৰম্ভণি',
'Life-Lesson':'জীৱনৰ শিক্ষা','Hope':'আশা','Equilibrium':'সমতা','Adjustment':'সমন্বয়','Partnership':'অংশীদাৰিত্ব','Good Prospects':'ভাল সম্ভাৱনা','Material Desires':'বস্তুগত কামনা','Obsession':'আসক্তি','Lust':'লালসা','Avarice':'লোভ','Bondage':'বন্ধন','Crash of Expectations':'আশাভংগ',
'Necessary Change':'প্ৰয়োজনীয় পৰিৱৰ্তন','Unfulfilled Expectations':'অপূৰ্ণ আশা','Shocking News':'চমকপ্ৰদ খবৰ','Solace':'সান্ত্বনা','Sustained Hard Work':'অবিৰত কঠোৰ পৰিশ্ৰম','a Gift':'উপহাৰ','Universal Blessing':'সাৰ্বজনীন আশীৰ্বাদ','Insight':'অন্তৰ্দৃষ্টি','Optimism':'আশাবাদ','Organic Change':'স্বাভাৱিক পৰিৱৰ্তন',
'Hidden Currents':'লুকাই থকা প্ৰবাহ','Ambiguity':'অস্পষ্টতা','Distrust':'অবিশ্বাস','Enlightenment':'জ্ঞানোদয়','Transparency':'স্বচ্ছতা','Confidence':'আত্মবিশ্বাস','Success':'সফলতা','Joy':'আনন্দ','Prosperity':'সমৃদ্ধি','Change of Direction':'দিশা সলনি','Final Settlement':'চূড়ান্ত মীমাংসা','Amendments':'সংশোধন',
'Regrets':'অনুতাপ','Completion of a Cycle':'চক্ৰ সম্পূৰ্ণ হোৱা','Fulfillment':'পৰিপূৰ্ণতা','Achievement':'অৰ্জন','Satisfaction':'সন্তুষ্টি'},P);
P['Judgement']='চূড়ান্ত বিচাৰ';

/* the book's rating of each card */
add({'A Very Positive Card':'অতি শুভ কাৰ্ড','Very Positive Card':'অতি শুভ কাৰ্ড','Very Positive card':'অতি শুভ কাৰ্ড','A gray card':'ধূসৰ কাৰ্ড (মিশ্ৰ)','Gray card':'ধূসৰ কাৰ্ড (মিশ্ৰ)','Gray Card indicating struggle.':'সংগ্ৰামৰ ইংগিত দিয়া ধূসৰ কাৰ্ড',
'Medium Positive card with note of caution':'মাজাৰি শুভ কাৰ্ড, সাৱধানতাৰ সৈতে','Positive card with caution':'সাৱধানতাৰ সৈতে শুভ কাৰ্ড','Positive Card':'শুভ কাৰ্ড','Positive card':'শুভ কাৰ্ড','Dark card':'অন্ধকাৰ কাৰ্ড (অশুভ)','Dark Card':'অন্ধকাৰ কাৰ্ড (অশুভ)',
'Medium Positive card':'মাজাৰি শুভ কাৰ্ড','Challenging card':'প্ৰত্যাহ্বানমূলক কাৰ্ড','Dark card with a smart lining':'অন্ধকাৰ কাৰ্ড, কিন্তু ভিতৰত আশাৰ ৰেখা','Dark card that can Empower':'অন্ধকাৰ কাৰ্ড, যিয়ে শক্তি দিব পাৰে','Gray and Volatile Card':'ধূসৰ আৰু অস্থিৰ কাৰ্ড',
'Troublesome and Volatile Card':'জটিল আৰু অস্থিৰ কাৰ্ড','Intellectual Card':'বৌদ্ধিক কাৰ্ড','Difficult card':'কঠিন কাৰ্ড','Karmic card. Very Positive':'কৰ্মিক কাৰ্ড। অতি শুভ','Moderate Positive card':'মধ্যম শুভ কাৰ্ড','Extremely Positive Card':'অতিশয় শুভ কাৰ্ড',
'Stable Card of New Beginnings':'নতুন আৰম্ভণিৰ স্থিৰ কাৰ্ড','Promising and Hopeful Card':'আশাব্যঞ্জক আৰু প্ৰতিশ্ৰুতিপূৰ্ণ কাৰ্ড'},P);
})();
