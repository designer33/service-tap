export const PROVINCES = [
  { value: 'Punjab',           label: 'Punjab' },
  { value: 'Sindh',            label: 'Sindh' },
  { value: 'KPK',              label: 'Khyber Pakhtunkhwa (KPK)' },
  { value: 'Balochistan',      label: 'Balochistan' },
  { value: 'Islamabad',        label: 'Islamabad (Federal Capital)' },
  { value: 'AJK',              label: 'Azad Jammu & Kashmir (AJK)' },
  { value: 'Gilgit-Baltistan', label: 'Gilgit-Baltistan' },
];

export const CITIES_BY_PROVINCE = {
  Punjab: [
    'Lahore', 'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala', 'Sialkot',
    'Bahawalpur', 'Sargodha', 'Sheikhupura', 'Jhang', 'Gujrat', 'Chiniot',
    'Okara', 'Kasur', 'Rahim Yar Khan', 'Sahiwal', 'Dera Ghazi Khan',
    'Jhelum', 'Wazirabad', 'Khanewal', 'Hafizabad', 'Mianwali', 'Attock',
    'Narowal', 'Pakpattan', 'Toba Tek Singh', 'Vehari', 'Nankana Sahib',
    'Muzaffargarh', 'Bhakkar', 'Lodhran', 'Khushab', 'Layyah',
  ],
  Sindh: [
    'Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpur Khas',
    'Thatta', 'Dadu', 'Jacobabad', 'Shikarpur', 'Khairpur', 'Sanghar',
    'Badin', 'Tando Adam', 'Tando Allahyar', 'Umerkot', 'Ghotki', 'Kashmore',
  ],
  KPK: [
    'Peshawar', 'Abbottabad', 'Mardan', 'Mingora', 'Kohat', 'Bannu',
    'Dera Ismail Khan', 'Nowshera', 'Mansehra', 'Charsadda', 'Swabi',
    'Haripur', 'Karak', 'Lakki Marwat', 'Hangu', 'Chitral', 'Dir (Upper)',
    'Dir (Lower)', 'Buner', 'Malakand', 'Swat', 'Tank', 'Shangla',
  ],
  Balochistan: [
    'Quetta', 'Turbat', 'Khuzdar', 'Gwadar', 'Hub', 'Chaman', 'Zhob',
    'Sibi', 'Loralai', 'Pishin', 'Kalat', 'Kharan', 'Nushki', 'Mastung',
    'Awaran', 'Lasbela', 'Dera Bugti', 'Kech', 'Panjgur', 'Washuk',
  ],
  Islamabad: ['Islamabad'],
  AJK: [
    'Muzaffarabad', 'Mirpur', 'Rawalakot', 'Kotli', 'Bhimber', 'Bagh',
    'Haveli', 'Poonch', 'Neelum', 'Hattian Bala',
  ],
  'Gilgit-Baltistan': [
    'Gilgit', 'Skardu', 'Hunza (Karimabad)', 'Ghanche', 'Astore',
    'Ghizer', 'Chilas', 'Diamer', 'Kharmang', 'Shigar',
  ],
};

/** Returns sorted cities for a given province value, or [] if province unknown */
export const getCities = (province) => CITIES_BY_PROVINCE[province] || [];
