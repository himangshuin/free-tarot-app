/* Assamese dictionary, part 3: card meta lines, crystals, gems, astrology phrases. */
(function(){
var A=window.TAROT_AS,P=A.P,T=A.TERMS,PAT=A.PAT;
function add(o,t){for(var k in o)(t||P)[k]=o[k]}
/* "Task" line of each Major Arcana card */
add({
"Trying out new things without any bias":"কোনো পক্ষপাত নোহোৱাকৈ নতুন কথা চেষ্টা কৰা",
"Activity, Taking Initiative, Giving Impulses, Accepting Tasks and Mastering them":"কৰ্মতৎপৰতা, উদ্যোগ লোৱা, প্ৰেৰণা দিয়া, কাম গ্ৰহণ কৰা আৰু সেইবোৰত দক্ষ হোৱা",
"Patiently waiting for an inner or outer impulse, silence, receptivity, healing serving as an echo":"ভিতৰুৱা বা বাহিৰৰ প্ৰেৰণাৰ বাবে ধৈৰ্য্যেৰে অপেক্ষা, নীৰৱতা, গ্ৰহণশীলতা, প্ৰতিধ্বনিৰ দৰে নিৰাময়",
"Being fertile; bringing something new in this world":"উৰ্বৰ হোৱা; এই জগতলৈ নতুন কিবা আনা",
"Uncompromisingly turning long held intentions., ideas into reality":"দীঘলীয়া সময়ৰ উদ্দেশ্য আৰু ধাৰণাক আপোচহীনভাৱে বাস্তৱ ৰূপ দিয়া",
"Paying attention to and respecting what is apparent and what is concealed; the search for meaning":"যি স্পষ্ট আৰু যি লুকুৱা তালৈ মনোযোগ আৰু সন্মান; অৰ্থৰ সন্ধান",
"Making a decision of one’s own Free Will and based on what lies at the bottom of the heart":"নিজৰ স্বাধীন ইচ্ছা আৰু হৃদয়ৰ গভীৰত থকা কথাৰ ওপৰত ভিত্তি কৰি সিদ্ধান্ত লোৱা",
"Mastering contradictions, Risking something new":"বিৰোধাভাসত দক্ষ হোৱা, নতুন কিবাত জুকি লোৱা",
"Enjoyable acceptance of life, courage and commitment":"জীৱনৰ আনন্দময় গ্ৰহণ, সাহস আৰু প্ৰতিশ্ৰুতি",
"Retreating into oneself, appropriate seriousness, contemplation":"নিজৰ ভিতৰলৈ প্ৰত্যাৱৰ্তন, উপযুক্ত গাম্ভীৰ্য, গভীৰ চিন্তন",
"Insight into what is necessary, facing one’s task":"কি প্ৰয়োজনীয় তাৰ অন্তৰ্দৃষ্টি, নিজৰ কৰ্তব্যৰ সন্মুখীন হোৱা",
"Understanding the laws of this world, passing an intelligent and balanced judgement, personal courage":"এই জগতৰ নিয়ম বুজা, বুদ্ধিমান আৰু ভাৰসাম্যপূৰ্ণ বিচাৰ দিয়া, ব্যক্তিগত সাহস",
"Changing one’s way, Insights and willingness to make a sacrifice":"নিজৰ পথ সলনি কৰা, অন্তৰ্দৃষ্টি আৰু ত্যাগৰ ইচ্ছা",
"Leave taking and descent into the underworld, Withdrawing, Separating":"বিদায় লোৱা আৰু পাতাললৈ অৱতৰণ, আঁতৰি অহা, বিচ্ছেদ",
"Trusting the higher guidance, finding the right mixture":"উচ্চতৰ নিৰ্দেশনাত বিশ্বাস, সঠিক মিশ্ৰণ বিচাৰি উলিওৱা",
"Overcoming inner resistance, Insight into unlived shadow aspects, Taking back projections":"ভিতৰুৱা প্ৰতিৰোধ অতিক্ৰম, অজীয়া ছায়া-দিশৰ অন্তৰ্দৃষ্টি, আৰোপ ঘুৰাই লোৱা",
"Bursting boundaries that are too narrow, Breaking out of the outdated":"অতি সংকীৰ্ণ সীমা ভাঙি পেলোৱা, পুৰণি ধাৰণাৰ পৰা ওলাই অহা",
"Gaining hope. Vision of new future":"আশা লাভ। নতুন ভৱিষ্যতৰ দৃষ্টি",
"The Tightrope walk, cautiously overcoming the threshold of fear,not getting lost or losing oneself":"ৰচীৰ ওপৰেদি খোজ, সাৱধানে ভয়ৰ দেহলি পাৰ হোৱা, হেৰাই নাযোৱা বা নিজকে নেহেৰুওৱা",
"True Reconciliation":"প্ৰকৃত মিলন","Redemption, Liberation":"মুক্তি, উদ্ধাৰ","Arriving; Taking one’s place":"উপনীত হোৱা; নিজৰ স্থান লোৱা",
"Solar Plexus":"মণিপুৰ (নাভি)","Sacral/Swadishthana Chakra":"স্বাধিষ্ঠান চক্ৰ","Heart/Anahata Chakra":"অনাহত চক্ৰ","Root/Muladhara Chakra":"মূলাধাৰ চক্ৰ",
"Crown and Wisdom (Tree of Life, Vol II Ch 16)":"মুকুট আৰু প্ৰজ্ঞা (জীৱনবৃক্ষ, খণ্ড II অধ্যায় ১৬)"
});
/* crystals and gems (names used in the short card tables) */
add({'Quartz':'কোৱাৰ্টজ','Green Tourmaline':'সেউজীয়া টৰমেলাইন','Lepidolite':'লেপিডোলাইট','Black Tourmaline':'ক\'লা টৰমেলাইন','Tiger’s Eye':'টাইগাৰ\'ছ আই','Sunstone':'সানষ্টোন','Blue Topaz':'নীলা পোখৰাজ','Celestite':'চেলেষ্টাইট','Haematite':'হেমাটাইট','Haemetite':'হেমাটাইট','Ametrine':'অ্যামেট্ৰিন','Banded Agate':'বেণ্ডেড আগেট','Howlite':'হাউলাইট','Chalcedony':'কেলচেডনি','Bloodstone':'ব্লাডষ্টোন','bloodstone':'ব্লাডষ্টোন','Blood stone':'ব্লাডষ্টোন','Kyanite':'কায়ানাইট','Yellow topaz':'হালধীয়া পোখৰাজ','Yellow Topaz':'হালধীয়া পোখৰাজ','Aventurine':'এভেঞ্চুৰিন','Jade':'জেড','Green Jade':'সেউজীয়া জেড','Beryl':'বেৰিল','Kunzite':'কুঞ্জাইট','Sardonyx':'সাৰ্ডনিক্স','Obsidian':'অবছিডিয়ান','Jet Stone':'জেট ষ্টোন','Chrysocolla':'ক্ৰিছোকোলা','Sugilite':'চুগিলাইট','Moldavite':'মল্ডাভাইট','Selenite':'চেলেনাইট','Unakite':'উনাকাইট','Malachite':'মেলাকাইট','Fluorite':'ফ্লুৰাইট','Zircon':'জাৰ্কন','Fire Opal':'ফায়াৰ অপাল','Blue Hakik':'নীলা হাকিক','Yellow Hakik':'হালধীয়া হাকিক','Green Hakik':'সেউজীয়া হাকিক','White Sapphire':'বগা নীলম','Banded agate':'বেণ্ডেড আগেট'});
/* virtues of the Tree of Life */
add({'Understanding':'বোধ','Beauty':'সৌন্দৰ্য','Severity':'কঠোৰতা','Mercy':'দয়া','Victory':'বিজয়','Splendour':'ঐশ্বৰ্য','Foundation':'ভেটি','Kingdom':'ৰাজ্য'});
/* chakra names */
var CH={Root:'মূলাধাৰ',Sacral:'স্বাধিষ্ঠান','Solar Plexus':'মণিপুৰ',Heart:'অনাহত',Throat:'বিশুদ্ধ','Third Eye':'আজ্ঞা',Crown:'সহস্ৰাৰ'};
var SG={Aries:'মেষ',Taurus:'বৃষ',Gemini:'মিথুন',Cancer:'কৰ্কট',Leo:'সিংহ',Virgo:'কন্যা',Libra:'তুলা',Scorpio:'বৃশ্চিক',Sagittarius:'ধনু',Sagitarrius:'ধনু',Capricorn:'মকৰ',Aquarius:'কুম্ভ',Pisces:'মীন'};
var PL={sun:'সূৰ্য',moon:'চন্দ্ৰ',mars:'মঙ্গল',mercury:'বুধ',jupiter:'বৃহস্পতি',venus:'শুক্ৰ',saturn:'শনি'};
var EL={fire:'অগ্নি',water:'জল',air:'বায়ু',earth:'পৃথিৱী'};
function cap(s){s=s.trim();return s.charAt(0).toUpperCase()+s.slice(1).toLowerCase()}
function sg(s){s=s.trim();return SG[cap(s)]||s}
add({'and':'আৰু','What the year holds':'বছৰটোত কি আছে','Saphhire':'নীলম','&':'আৰু'});
var MN={January:'জানুৱাৰী',February:'ফেব্ৰুৱাৰী',March:'মাৰ্চ',April:'এপ্ৰিল',May:'মে\'',June:'জুন',July:'জুলাই',August:'আগষ্ট',September:'ছেপ্টেম্বৰ',October:'অক্টোবৰ',November:'নৱেম্বৰ',December:'ডিচেম্বৰ'};
PAT.unshift(
[/^(January|February|March|April|May|June|July|August|September|October|November|December) (\d+) – (January|February|March|April|May|June|July|August|September|October|November|December) (\d+)$/,function(m){return m[2]+' '+MN[m[1]]+' – '+m[4]+' '+MN[m[3]]}],
[/^(\d+) layouts from the two books, plus a builder for your own\. Draw cards at random, or lay out your own physical deck and pick each card by name\.$/,function(m){return 'দুয়োখন কিতাপৰ '+m[1]+'টা বিন্যাস, লগতে নিজৰ বাবে বনোৱাৰ সঁজুলি। আচৰিতভাৱে কাৰ্ড উলিয়াওক, বা নিজৰ বাস্তৱ ডেক সজাই প্ৰতিখন কাৰ্ড নাম অনুসৰি বাছক।'}],
[/^(.+): empty, tap to draw$/,function(m,t){return t(m[1])+': খালী, কাৰ্ড উলিয়াবলৈ টিপক'}],
[/^(.+): face down, tap to reveal$/,function(m,t){return t(m[1])+': উপুৰি কাৰ্ড, দেখিবলৈ টিপক'}],
[/^(Root|Sacral|Solar Plexus|Heart|Throat|Third Eye|Crown) ?\/ ?(\w+)(?: Chakra)?$/i,function(m){var k=m[1].replace(/\b\w/g,function(c){return c.toUpperCase()});return CH[k]?CH[k]+(/chakra/i.test(m[0])?' চক্ৰ':''):null}],
[/^(Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn) in (\w+)$/i,function(m){var p=PL[m[1].toLowerCase()],s=sg(m[2]);return p?s+'ত '+p:null}],
[/^Cusp of (\w+) ?\/ ?(\w+)$/i,function(m){return sg(m[1])+' / '+sg(m[2])+' সন্ধিক্ষণ'}],
[/^Personification of (Fire|Water|Air|Earth) \(Element only\)$/i,function(m){return EL[m[1].toLowerCase()]+' তত্ত্বৰ মূৰ্তৰূপ (কেৱল তত্ত্ব)'}],
[/^(.+?) and (.+)$/,function(m,t){if(m[0].length>70)return null;var a=t(m[1]),b=t(m[2]);return a===m[1]||b===m[2]?null:a+' আৰু '+b}],
[/^(.+?) and (.+) \(Tree of Life, Vol II Ch 16\)$/,function(m,t){return t(m[1])+' আৰু '+t(m[2])+' (জীৱনবৃক্ষ, খণ্ড II অধ্যায় ১৬)'}]
);
/* the generic "A and B" rule must not swallow the Tree of Life one: put that one first */
var last=PAT.pop();PAT.unshift(last);
PAT.push([/^(.{2,80}?): (.{1,60})$/,function(m,t){var a=t(m[1]),b=t(m[2]);return a===m[1]&&b===m[2]?null:a+': '+b}]);
})();
