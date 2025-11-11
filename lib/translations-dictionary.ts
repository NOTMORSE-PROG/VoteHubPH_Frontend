// Static translations dictionary to avoid API calls for common phrases
// This prevents rate limiting and provides instant translations

export const translations: Record<string, Record<string, string>> = {
  // Navigation
  "Browse": { fil: "Mag-browse", tl: "Mag-browse" },
  "Elections": { fil: "Halalan", tl: "Halalan" },
  "Statistics": { fil: "Estadistika", tl: "Estadistika" },
  "Settings": { fil: "Mga Setting", tl: "Mga Setting" },

  // Hero Section
  "Explore Candidates": { fil: "Tuklasin ang mga Kandidato", tl: "Tuklasin ang mga Kandidato" },
  "Make informed voting decisions for the Philippines 2025 elections": {
    fil: "Gumawa ng matalinong desisyon sa pagboto para sa Halalan 2025 ng Pilipinas",
    tl: "Gumawa ng matalinong desisyon sa pagboto para sa Halalan 2025 ng Pilipinas"
  },
  "Get Started": { fil: "Magsimula", tl: "Magsimula" },
  "View Elections": { fil: "Tingnan ang mga Halalan", tl: "Tingnan ang mga Halalan" },

  // Tabs
  "All Candidates": { fil: "Lahat ng Kandidato", tl: "Lahat ng Kandidato" },
  "Local": { fil: "Lokal", tl: "Lokal" },
  "National": { fil: "Pambansa", tl: "Pambansa" },
  "Party-List": { fil: "Party-List", tl: "Party-List" },

  // Search and Filter
  "Search candidates...": { fil: "Maghanap ng kandidato...", tl: "Maghanap ng kandidato..." },
  "Filter": { fil: "I-filter", tl: "I-filter" },
  "Sort by": { fil: "Ayusin ayon sa", tl: "Ayusin ayon sa" },
  "Name": { fil: "Pangalan", tl: "Pangalan" },
  "Position": { fil: "Posisyon", tl: "Posisyon" },
  "Location": { fil: "Lokasyon", tl: "Lokasyon" },
  "All Positions": { fil: "Lahat ng Posisyon", tl: "Lahat ng Posisyon" },
  "All Locations": { fil: "Lahat ng Lokasyon", tl: "Lahat ng Lokasyon" },

  // Positions
  "President": { fil: "Pangulo", tl: "Pangulo" },
  "Vice President": { fil: "Bise Presidente", tl: "Bise Presidente" },
  "Senator": { fil: "Senador", tl: "Senador" },
  "Mayor": { fil: "Alkalde", tl: "Alkalde" },
  "Vice Mayor": { fil: "Bise Alkalde", tl: "Bise Alkalde" },
  "Governor": { fil: "Gobernador", tl: "Gobernador" },
  "Representative": { fil: "Kinatawan", tl: "Kinatawan" },
  "Councilor": { fil: "Konsehal", tl: "Konsehal" },

  // Locations
  "Metro Manila": { fil: "Metro Manila", tl: "Metro Manila" },
  "Quezon City": { fil: "Lungsod Quezon", tl: "Lungsod Quezon" },
  "Manila": { fil: "Maynila", tl: "Maynila" },
  "Makati": { fil: "Makati", tl: "Makati" },
  "Pasig": { fil: "Pasig", tl: "Pasig" },
  "Cebu": { fil: "Cebu", tl: "Cebu" },
  "Davao": { fil: "Davao", tl: "Davao" },

  // Candidate Card
  "View Profile": { fil: "Tingnan ang Profile", tl: "Tingnan ang Profile" },
  "Running for": { fil: "Tumatakbo bilang", tl: "Tumatakbo bilang" },
  "Party": { fil: "Partido", tl: "Partido" },
  "Independent": { fil: "Independyente", tl: "Independyente" },

  // Party-List
  "Sector": { fil: "Sektor", tl: "Sektor" },
  "Youth": { fil: "Kabataan", tl: "Kabataan" },
  "Women": { fil: "Kababaihan", tl: "Kababaihan" },
  "Labor": { fil: "Manggagawa", tl: "Manggagawa" },
  "Farmers": { fil: "Magsasaka", tl: "Magsasaka" },
  "Urban Poor": { fil: "Maralitang Lunsod", tl: "Maralitang Lunsod" },
  "Indigenous Peoples": { fil: "Katutubo", tl: "Katutubo" },
  "Senior Citizens": { fil: "Matatanda", tl: "Matatanda" },
  "Persons with Disabilities": { fil: "May Kapansanan", tl: "May Kapansanan" },
  "Professionals": { fil: "Propesyonal", tl: "Propesyonal" },
  "Fisherfolk": { fil: "Mangingisda", tl: "Mangingisda" },
  "Overseas Workers": { fil: "OFW", tl: "OFW" },
  "LGBTQ+": { fil: "LGBTQ+", tl: "LGBTQ+" },
  "Environment": { fil: "Kalikasan", tl: "Kalikasan" },
  "Other": { fil: "Iba pa", tl: "Iba pa" },

  // Profile Page
  "Platform": { fil: "Plataporma", tl: "Plataporma" },
  "Key Achievements": { fil: "Mga Pangunahing Nagawa", tl: "Mga Pangunahing Nagawa" },
  "Education": { fil: "Edukasyon", tl: "Edukasyon" },
  "Track Record": { fil: "Track Record", tl: "Track Record" },
  "Contact Information": { fil: "Impormasyon sa Pakikipag-ugnayan", tl: "Impormasyon sa Pakikipag-ugnayan" },

  // Actions
  "Support": { fil: "Suportahan", tl: "Suportahan" },
  "Share": { fil: "Ibahagi", tl: "Ibahagi" },
  "Compare": { fil: "Ikumpara", tl: "Ikumpara" },
  "Save": { fil: "I-save", tl: "I-save" },
  "Back": { fil: "Bumalik", tl: "Bumalik" },
  "Next": { fil: "Susunod", tl: "Susunod" },
  "Previous": { fil: "Nakaraan", tl: "Nakaraan" },
  "Close": { fil: "Isara", tl: "Isara" },
  "Cancel": { fil: "Kanselahin", tl: "Kanselahin" },
  "Confirm": { fil: "Kumpirmahin", tl: "Kumpirmahin" },

  // Login/Auth
  "Login": { fil: "Mag-login", tl: "Mag-login" },
  "Sign Up": { fil: "Mag-sign Up", tl: "Mag-sign Up" },
  "Email": { fil: "Email", tl: "Email" },
  "Password": { fil: "Password", tl: "Password" },
  "Continue with Google": { fil: "Magpatuloy gamit ang Google", tl: "Magpatuloy gamit ang Google" },
  "Forgot Password?": { fil: "Nakalimutan ang Password?", tl: "Nakalimutan ang Password?" },
  "Don't have an account?": { fil: "Walang account?", tl: "Walang account?" },
  "Already have an account?": { fil: "Mayroon nang account?", tl: "Mayroon nang account?" },

  // Settings
  "Language": { fil: "Wika", tl: "Wika" },
  "Theme": { fil: "Tema", tl: "Tema" },
  "Notifications": { fil: "Mga Abiso", tl: "Mga Abiso" },
  "Privacy": { fil: "Privacy", tl: "Privacy" },
  "About": { fil: "Tungkol", tl: "Tungkol" },
  "Help": { fil: "Tulong", tl: "Tulong" },
  "Logout": { fil: "Mag-logout", tl: "Mag-logout" },

  // Statistics
  "Total Candidates": { fil: "Kabuuang Kandidato", tl: "Kabuuang Kandidato" },
  "Total Votes": { fil: "Kabuuang Boto", tl: "Kabuuang Boto" },
  "Registered Voters": { fil: "Rehistradong Botante", tl: "Rehistradong Botante" },
  "Election Date": { fil: "Petsa ng Halalan", tl: "Petsa ng Halalan" },

  // Elections
  "Upcoming": { fil: "Paparating", tl: "Paparating" },
  "Ongoing": { fil: "Kasalukuyan", tl: "Kasalukuyan" },
  "Past": { fil: "Nakaraan", tl: "Nakaraan" },
  "Results": { fil: "Mga Resulta", tl: "Mga Resulta" },

  // Common phrases
  "Loading...": { fil: "Naglo-load...", tl: "Naglo-load..." },
  "No results found": { fil: "Walang nahanap", tl: "Walang nahanap" },
  "Try again": { fil: "Subukan muli", tl: "Subukan muli" },
  "Error": { fil: "Error", tl: "Error" },
  "Success": { fil: "Tagumpay", tl: "Tagumpay" },
  "Warning": { fil: "Babala", tl: "Babala" },
  "Info": { fil: "Impormasyon", tl: "Impormasyon" },

  // Descriptions and longer text
  "Empowering Filipino voters with comprehensive candidate information": {
    fil: "Pagbibigay-kapangyarihan sa mga botanteng Pilipino ng komprehensibong impormasyon tungkol sa mga kandidato",
    tl: "Pagbibigay-kapangyarihan sa mga botanteng Pilipino ng komprehensibong impormasyon tungkol sa mga kandidato"
  },
  "Browse candidates by position, location, or party": {
    fil: "Mag-browse ng mga kandidato ayon sa posisyon, lokasyon, o partido",
    tl: "Mag-browse ng mga kandidato ayon sa posisyon, lokasyon, o partido"
  },
  "Make informed decisions for the Philippines": {
    fil: "Gumawa ng matalinong desisyon para sa Pilipinas",
    tl: "Gumawa ng matalinong desisyon para sa Pilipinas"
  },

  // Homepage - Missing phrases from errors
  "Make informed voting decisions with transparent candidate information, community insights, and real-time updates.": {
    fil: "Gumawa ng matalinong desisyon sa pagboto gamit ang transparent na impormasyon ng kandidato, opinyon ng komunidad, at real-time na updates.",
    tl: "Gumawa ng matalinong desisyon sa pagboto gamit ang transparent na impormasyon ng kandidato, opinyon ng komunidad, at real-time na updates."
  },
  "🇵🇭 Philippine Elections": {
    fil: "🇵🇭 Halalan sa Pilipinas",
    tl: "🇵🇭 Halalan sa Pilipinas"
  },
  "Candidates": { fil: "Mga Kandidato", tl: "Mga Kandidato" },
  "Why Choose VoteHubPH?": {
    fil: "Bakit Piliin ang VoteHubPH?",
    tl: "Bakit Piliin ang VoteHubPH?"
  },
  "Transparent Information": {
    fil: "Transparent na Impormasyon",
    tl: "Transparent na Impormasyon"
  },
  "17 Regions": { fil: "17 Rehiyon", tl: "17 Rehiyon" },
  "Platform Coverage": {
    fil: "Saklaw ng Platform",
    tl: "Saklaw ng Platform"
  },
  "Voting Analytics": {
    fil: "Estadistika ng Pagboto",
    tl: "Estadistika ng Pagboto"
  },
  "Full coverage": {
    fil: "Kumpletong saklaw",
    tl: "Kumpletong saklaw"
  },
  "Account": { fil: "Account", tl: "Account" },
  "Create Account": {
    fil: "Gumawa ng Account",
    tl: "Gumawa ng Account"
  },
  "Privacy Policy": {
    fil: "Patakaran sa Privacy",
    tl: "Patakaran sa Privacy"
  },
  "Stay informed with live candidate information, community posts, and engagement statistics.": {
    fil: "Manatiling updated sa live na impormasyon ng kandidato, post ng komunidad, at estadistika ng engagement.",
    tl: "Manatiling updated sa live na impormasyon ng kandidato, post ng komunidad, at estadistika ng engagement."
  },
  "1000+ Candidates": {
    fil: "1000+ Kandidato",
    tl: "1000+ Kandidato"
  },
  "Sign In": { fil: "Mag-sign In", tl: "Mag-sign In" },
  "Elections & Statistics": {
    fil: "Halalan at Estadistika",
    tl: "Halalan at Estadistika"
  },
  "Barangays": { fil: "Mga Barangay", tl: "Mga Barangay" },
  "Browse Candidates": {
    fil: "Mag-browse ng mga Kandidato",
    tl: "Mag-browse ng mga Kandidato"
  },
  "Engage in discussions, share insights, and participate in community voting.": {
    fil: "Makiisa sa diskusyon, magbahagi ng opinyon, at lumahok sa pagboto ng komunidad.",
    tl: "Makiisa sa diskusyon, magbahagi ng opinyon, at lumahok sa pagboto ng komunidad."
  },
  "Continue as Guest": {
    fil: "Magpatuloy bilang Bisita",
    tl: "Magpatuloy bilang Bisita"
  },
  "Everything you need to make informed voting decisions": {
    fil: "Lahat ng kailangan mo para gumawa ng matalinong desisyon sa pagboto",
    tl: "Lahat ng kailangan mo para gumawa ng matalinong desisyon sa pagboto"
  },
  "Vote and comment anonymously or publicly. Your privacy and security are our priorities.": {
    fil: "Bumoto at mag-comment nang anonymous o publicly. Ang iyong privacy at seguridad ay aming priyoridad.",
    tl: "Bumoto at mag-comment nang anonymous o publicly. Ang iyong privacy at seguridad ay aming priyoridad."
  },
  "Community Driven": {
    fil: "Pinapatakbo ng Komunidad",
    tl: "Pinapatakbo ng Komunidad"
  },
  "Terms of Service": {
    fil: "Mga Tuntunin ng Serbisyo",
    tl: "Mga Tuntunin ng Serbisyo"
  },
  "See community sentiment through voting and polling features. Understand what matters to fellow Filipinos.": {
    fil: "Tingnan ang opinyon ng komunidad sa pamamagitan ng voting at polling. Maintindihan kung ano ang mahalaga sa kapwa Pilipino.",
    tl: "Tingnan ang opinyon ng komunidad sa pamamagitan ng voting at polling. Maintindihan kung ano ang mahalaga sa kapwa Pilipino."
  },
  "Empowering informed voting decisions across the Philippines.": {
    fil: "Pagbibigay-lakas sa matalinong desisyon sa pagboto sa buong Pilipinas.",
    tl: "Pagbibigay-lakas sa matalinong desisyon sa pagboto sa buong Pilipinas."
  },
  "Access detailed platforms, past contributions, party affiliations, and track records.": {
    fil: "Ma-access ang detalyadong plataporma, nakaraang kontribusyon, party affiliation, at track record.",
    tl: "Ma-access ang detalyadong plataporma, nakaraang kontribusyon, party affiliation, at track record."
  },
  "Regions": { fil: "Mga Rehiyon", tl: "Mga Rehiyon" },
  "Legal": { fil: "Legal", tl: "Legal" },
  "Join thousands of Filipinos making informed voting decisions. Start exploring candidates now!": {
    fil: "Sumali sa libu-libong Pilipino na gumagawa ng matalinong desisyon sa pagboto. Magsimulang mag-explore ng mga kandidato ngayon!",
    tl: "Sumali sa libu-libong Pilipino na gumagawa ng matalinong desisyon sa pagboto. Magsimulang mag-explore ng mga kandidato ngayon!"
  },
  "Across all levels": {
    fil: "Sa lahat ng antas",
    tl: "Sa lahat ng antas"
  },
  "Find candidates specific to your barangay, city, and region. Browse all levels from local to national.": {
    fil: "Maghanap ng kandidato para sa iyong barangay, lungsod, at rehiyon. Mag-browse mula lokal hanggang pambansa.",
    tl: "Maghanap ng kandidato para sa iyong barangay, lungsod, at rehiyon. Mag-browse mula lokal hanggang pambansa."
  },
  "Secure & Private": {
    fil: "Secure at Private",
    tl: "Secure at Private"
  },
  "Real-Time Updates": {
    fil: "Real-Time na Updates",
    tl: "Real-Time na Updates"
  },
  "Real discussions": {
    fil: "Tunay na diskusyon",
    tl: "Tunay na diskusyon"
  },
  "© 2025 VoteHubPH. Empowering informed voting decisions across the Philippines.": {
    fil: "© 2025 VoteHubPH. Pagbibigay-lakas sa matalinong desisyon sa pagboto sa buong Pilipinas.",
    tl: "© 2025 VoteHubPH. Pagbibigay-lakas sa matalinong desisyon sa pagboto sa buong Pilipinas."
  },
  "Your Voice Shapes the Future": {
    fil: "Ang Iyong Tinig ang Bumubuo ng Kinabukasan",
    tl: "Ang Iyong Tinig ang Bumubuo ng Kinabukasan"
  },
  "Location-Based Discovery": {
    fil: "Pagtuklas Base sa Lokasyon",
    tl: "Pagtuklas Base sa Lokasyon"
  },
  "Cities & Municipalities": {
    fil: "Mga Lungsod at Munisipalidad",
    tl: "Mga Lungsod at Munisipalidad"
  },
  "Community Engagement": {
    fil: "Pakikilahok ng Komunidad",
    tl: "Pakikilahok ng Komunidad"
  },
  "Ready to Make Your Voice Heard?": {
    fil: "Handa Nang Ipahayag ang Iyong Tinig?",
    tl: "Handa Nang Ipahayag ang Iyong Tinig?"
  },

  // Browse page
  "Create Post": { fil: "Gumawa ng Post", tl: "Gumawa ng Post" },
  "Profile": { fil: "Profile", tl: "Profile" },
  "Choose your region, city, and barangay to see local candidates": {
    fil: "Pumili ng iyong rehiyon, lungsod, at barangay para makita ang mga lokal na kandidato",
    tl: "Pumili ng iyong rehiyon, lungsod, at barangay para makita ang mga lokal na kandidato"
  },
  "Select Your Location": {
    fil: "Pumili ng Iyong Lokasyon",
    tl: "Pumili ng Iyong Lokasyon"
  },

  // Candidate details
  "National Candidates": {
    fil: "Mga Pambansang Kandidato",
    tl: "Mga Pambansang Kandidato"
  },
  "Key Platform Points": {
    fil: "Mga Pangunahing Punto ng Plataporma",
    tl: "Mga Pangunahing Punto ng Plataporma"
  },
  "candidates found": {
    fil: "kandidato ang nahanap",
    tl: "kandidato ang nahanap"
  },
  "Experience": { fil: "Karanasan", tl: "Karanasan" },
  "comments": { fil: "komento", tl: "komento" },
  "Running for": { fil: "Tumatakbo bilang", tl: "Tumatakbo bilang" },
  "votes": { fil: "boto", tl: "boto" },
  "Vote": { fil: "Bumoto", tl: "Bumoto" },

  // Candidate descriptions (from mock data)
  "Economic recovery and inclusive growth": {
    fil: "Pagbangon ng ekonomiya at inklusibong paglaki",
    tl: "Pagbangon ng ekonomiya at inklusibong paglaki"
  },
  "Current president focused on unity, economic recovery, and infrastructure development": {
    fil: "Kasalukuyang pangulo na nakatuon sa pagkakaisa, pagbangon ng ekonomiya, at pag-unlad ng imprastraktura",
    tl: "Kasalukuyang pangulo na nakatuon sa pagkakaisa, pagbangon ng ekonomiya, at pag-unlad ng imprastraktura"
  },
  "Agricultural modernization and food security": {
    fil: "Modernisasyon ng agrikultura at seguridad sa pagkain",
    tl: "Modernisasyon ng agrikultura at seguridad sa pagkain"
  },
  "Education reform": {
    fil: "Reporma sa edukasyon",
    tl: "Reporma sa edukasyon"
  },
  "Infrastructure development (Build Build Build continuation)": {
    fil: "Pag-unlad ng imprastraktura (Pagpapatuloy ng Build Build Build)",
    tl: "Pag-unlad ng imprastraktura (Pagpapatuloy ng Build Build Build)"
  },
  "Social services": {
    fil: "Mga serbisyong panlipunan",
    tl: "Mga serbisyong panlipunan"
  },
  "Current vice president and former Davao mayor": {
    fil: "Kasalukuyang bise presidente at dating alkalde ng Davao",
    tl: "Kasalukuyang bise presidente at dating alkalde ng Davao"
  },
  "Peace and order": {
    fil: "Kapayapaan at kaayusan",
    tl: "Kapayapaan at kaayusan"
  },
  "Women and children protection": {
    fil: "Proteksyon ng kababaihan at mga bata",
    tl: "Proteksyon ng kababaihan at mga bata"
  },
  "OFW welfare and protection": {
    fil: "Kapakanaan at proteksyon ng OFW",
    tl: "Kapakanaan at proteksyon ng OFW"
  },
  "Broadcaster turned senator focused on public service": {
    fil: "Broadcaster na naging senador na nakatuon sa public service",
    tl: "Broadcaster na naging senador na nakatuon sa public service"
  },
  "Climate change mitigation": {
    fil: "Pagpapagaan ng climate change",
    tl: "Pagpapagaan ng climate change"
  },
  "Anti-red tape measures": {
    fil: "Mga hakbang laban sa red tape",
    tl: "Mga hakbang laban sa red tape"
  },
  "Incumbent senator advocating for health and human rights": {
    fil: "Kasalukuyang senador na tagapagtaguyod ng kalusugan at karapatang pantao",
    tl: "Kasalukuyang senador na tagapagtaguyod ng kalusugan at karapatang pantao"
  },
  "Disaster risk reduction": {
    fil: "Pagbawas ng panganib sa sakuna",
    tl: "Pagbawas ng panganib sa sakuna"
  },
  "Senator focused on education and culture": {
    fil: "Senador na nakatuon sa edukasyon at kultura",
    tl: "Senador na nakatuon sa edukasyon at kultura"
  },
  "Veteran legislator focused on environment and culture": {
    fil: "Beteranong mambabatas na nakatuon sa kapaligiran at kultura",
    tl: "Beteranong mambabatas na nakatuon sa kapaligiran at kultura"
  },
  "Education accessibility": {
    fil: "Accessibility ng edukasyon",
    tl: "Accessibility ng edukasyon"
  },
  "Infrastructure development": {
    fil: "Pag-unlad ng imprastraktura",
    tl: "Pag-unlad ng imprastraktura"
  },
  "Senator focused on health and social services": {
    fil: "Senador na nakatuon sa kalusugan at social services",
    tl: "Senador na nakatuon sa kalusugan at social services"
  },
  "Accessible justice for all": {
    fil: "Accessible na hustisya para sa lahat",
    tl: "Accessible na hustisya para sa lahat"
  },
  "Cultural heritage preservation": {
    fil: "Pangangalaga ng cultural heritage",
    tl: "Pangangalaga ng cultural heritage"
  },
  "Universal healthcare expansion": {
    fil: "Pagpapalawig ng universal healthcare",
    tl: "Pagpapalawig ng universal healthcare"
  },
  "Healthcare accessibility": {
    fil: "Accessibility ng healthcare",
    tl: "Accessibility ng healthcare"
  },
  "Cultural preservation": {
    fil: "Pangangalaga ng kultura",
    tl: "Pangangalaga ng kultura"
  },
  "Malasakit Centers expansion": {
    fil: "Pagpapalawig ng Malasakit Centers",
    tl: "Pagpapalawig ng Malasakit Centers"
  },
  "Social welfare programs": {
    fil: "Mga programa sa social welfare",
    tl: "Mga programa sa social welfare"
  },
  "Senator focused on education and energy": {
    fil: "Senador na nakatuon sa edukasyon at enerhiya",
    tl: "Senador na nakatuon sa edukasyon at enerhiya"
  },
  "Health programs": {
    fil: "Mga programa sa kalusugan",
    tl: "Mga programa sa kalusugan"
  },
  "Sports development": {
    fil: "Pag-unlad ng sports",
    tl: "Pag-unlad ng sports"
  },
  "Energy security": {
    fil: "Seguridad sa enerhiya",
    tl: "Seguridad sa enerhiya"
  },
  "Women empowerment": {
    fil: "Pagpapalakas ng kababaihan",
    tl: "Pagpapalakas ng kababaihan"
  },
  "Senator advocating for health and sports": {
    fil: "Senador na tagapagtaguyod ng kalusugan at sports",
    tl: "Senador na tagapagtaguyod ng kalusugan at sports"
  },
  "Economic development": {
    fil: "Pag-unlad ng ekonomiya",
    tl: "Pag-unlad ng ekonomiya"
  },

  // Filters
  "Running Again": {
    fil: "Tumatakbo Muli",
    tl: "Tumatakbo Muli"
  },
  "First Time": {
    fil: "Unang Beses",
    tl: "Unang Beses"
  },
  "All": { fil: "Lahat", tl: "Lahat" },

  // Auth pages - new translations
  "Welcome Back": { fil: "Maligayang Pagbabalik", tl: "Maligayang Pagbabalik" },
  "Sign in to your VoteHubPH account": {
    fil: "Mag-sign in sa iyong VoteHubPH account",
    tl: "Mag-sign in sa iyong VoteHubPH account"
  },
  "Create Account": { fil: "Gumawa ng Account", tl: "Gumawa ng Account" },
  "Join VoteHubPH and make your voice heard": {
    fil: "Sumali sa VoteHubPH at ipahayag ang iyong tinig",
    tl: "Sumali sa VoteHubPH at ipahayag ang iyong tinig"
  },
  "Enter the OTP sent to your email": {
    fil: "Ilagay ang OTP na ipinadala sa iyong email",
    tl: "Ilagay ang OTP na ipinadala sa iyong email"
  },
  "Name": { fil: "Pangalan", tl: "Pangalan" },
  "Confirm Password": { fil: "Kumpirmahin ang Password", tl: "Kumpirmahin ang Password" },
  "At least 8 characters": { fil: "Hindi bababa sa 8 characters", tl: "Hindi bababa sa 8 characters" },
  "Send OTP": { fil: "Ipadala ang OTP", tl: "Ipadala ang OTP" },
  "Sending OTP...": { fil: "Ipinapadala ang OTP...", tl: "Ipinapadala ang OTP..." },
  "Enter OTP": { fil: "Ilagay ang OTP", tl: "Ilagay ang OTP" },
  "Check your browser console for the OTP (development mode)": {
    fil: "Tingnan ang browser console para sa OTP (development mode)",
    tl: "Tingnan ang browser console para sa OTP (development mode)"
  },
  "Verify OTP": { fil: "I-verify ang OTP", tl: "I-verify ang OTP" },
  "Verifying...": { fil: "Nagve-verify...", tl: "Nagve-verify..." },
  "Resend OTP": { fil: "Ipadala Muli ang OTP", tl: "Ipadala Muli ang OTP" },
  "Already have an account?": { fil: "Mayroon na bang account?", tl: "Mayroon na bang account?" },
  "Don't have an account?": { fil: "Walang account?", tl: "Walang account?" },
  "Sign up": { fil: "Mag-sign up", tl: "Mag-sign up" },

  // Profile Completion
  "Complete Your Profile": { fil: "Kumpletuhin ang Iyong Profile", tl: "Kumpletuhin ang Iyong Profile" },
  "Help us personalize your experience by completing your profile": {
    fil: "Tulungan kami na i-personalize ang iyong karanasan sa pamamagitan ng pagkumpleto ng iyong profile",
    tl: "Tulungan kami na i-personalize ang iyong karanasan sa pamamagitan ng pagkumpleto ng iyong profile"
  },
  "Full Name": { fil: "Buong Pangalan", tl: "Buong Pangalan" },
  "Auto-detect": { fil: "Auto-detect", tl: "Auto-detect" },
  "Detecting...": { fil: "Nag-detect...", tl: "Nag-detect..." },
  "Saving...": { fil: "Nag-save...", tl: "Nag-save..." },
  "Continue to VoteHubPH": { fil: "Magpatuloy sa VoteHubPH", tl: "Magpatuloy sa VoteHubPH" },
}

// Helper function to get translation from dictionary
export function getStaticTranslation(text: string, targetLang: string): string | null {
  if (targetLang === 'en') return text

  const langCode = targetLang === 'fil' ? 'fil' : targetLang
  const translation = translations[text]?.[langCode]

  return translation || null
}
