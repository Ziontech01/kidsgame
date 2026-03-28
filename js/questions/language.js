// Happy Games – Language Game Data
// Languages: Spanish, French, Mandarin Chinese, Yoruba
// Categories: Greetings, Numbers, Food, Colours, Family, School
'use strict';

const LANGUAGE_DATA = {
  spanish: {
    name:'Spanish', flag:'🇪🇸', nativeName:'Español',
    funFact:'Spanish is spoken by over 500 million people across the world — it\'s the second most spoken language on Earth!',
    categories:{
      greetings:[
        { en:'Hello',               target:'Hola',             phonetic:'OH-la' },
        { en:'Good morning',        target:'Buenos días',       phonetic:'BWEH-nos DEE-as' },
        { en:'Good afternoon',      target:'Buenas tardes',     phonetic:'BWEH-nas TAR-des' },
        { en:'Good night',          target:'Buenas noches',     phonetic:'BWEH-nas NOH-ches' },
        { en:'Goodbye',             target:'Adiós',             phonetic:'ah-DYOS' },
        { en:'Thank you',           target:'Gracias',           phonetic:'GRAH-syahs' },
        { en:'Please',              target:'Por favor',         phonetic:'por fah-VOR' },
        { en:'Excuse me',           target:'Perdón',            phonetic:'per-DON' },
        { en:'How are you?',        target:'¿Cómo estás?',      phonetic:'KOH-mo es-TAS' },
        { en:'My name is...',       target:'Me llamo...',       phonetic:'meh YAH-mo' }
      ],
      numbers:[
        { en:'One',    target:'Uno',    phonetic:'OO-no' },
        { en:'Two',    target:'Dos',    phonetic:'dohs' },
        { en:'Three',  target:'Tres',   phonetic:'trehs' },
        { en:'Four',   target:'Cuatro', phonetic:'KWAH-troh' },
        { en:'Five',   target:'Cinco',  phonetic:'SEEN-koh' },
        { en:'Six',    target:'Seis',   phonetic:'sehs' },
        { en:'Seven',  target:'Siete',  phonetic:'SYEH-teh' },
        { en:'Eight',  target:'Ocho',   phonetic:'OH-choh' },
        { en:'Nine',   target:'Nueve',  phonetic:'NWEH-veh' },
        { en:'Ten',    target:'Diez',   phonetic:'dyehs' }
      ],
      food:[
        { en:'Water',     target:'Agua',      phonetic:'AH-gwah' },
        { en:'Bread',     target:'Pan',        phonetic:'pan' },
        { en:'Milk',      target:'Leche',      phonetic:'LEH-cheh' },
        { en:'Apple',     target:'Manzana',    phonetic:'man-SAH-nah' },
        { en:'Chicken',   target:'Pollo',      phonetic:'POH-yoh' },
        { en:'Rice',      target:'Arroz',      phonetic:'ah-ROHS' },
        { en:'Egg',       target:'Huevo',      phonetic:'WEH-voh' },
        { en:'Fish',      target:'Pescado',    phonetic:'pes-KAH-doh' },
        { en:'Cake',      target:'Pastel',     phonetic:'pas-TEL' },
        { en:'Orange',    target:'Naranja',    phonetic:'nah-RAHN-hah' }
      ],
      colours:[
        { en:'Red',    target:'Rojo',     phonetic:'ROH-hoh' },
        { en:'Blue',   target:'Azul',     phonetic:'ah-SOOL' },
        { en:'Yellow', target:'Amarillo', phonetic:'ah-mah-REE-yoh' },
        { en:'Green',  target:'Verde',    phonetic:'BER-deh' },
        { en:'Black',  target:'Negro',    phonetic:'NEH-groh' },
        { en:'White',  target:'Blanco',   phonetic:'BLAHN-koh' },
        { en:'Pink',   target:'Rosa',     phonetic:'ROH-sah' },
        { en:'Purple', target:'Morado',   phonetic:'moh-RAH-doh' },
        { en:'Orange', target:'Naranja',  phonetic:'nah-RAHN-hah' },
        { en:'Brown',  target:'Marrón',   phonetic:'mah-RON' }
      ],
      family:[
        { en:'Mother',      target:'Madre',        phonetic:'MAH-dreh' },
        { en:'Father',      target:'Padre',         phonetic:'PAH-dreh' },
        { en:'Brother',     target:'Hermano',       phonetic:'er-MAH-noh' },
        { en:'Sister',      target:'Hermana',       phonetic:'er-MAH-nah' },
        { en:'Grandmother', target:'Abuela',        phonetic:'ah-BWEH-lah' },
        { en:'Grandfather', target:'Abuelo',        phonetic:'ah-BWEH-loh' },
        { en:'Baby',        target:'Bebé',          phonetic:'beh-BEH' },
        { en:'Friend',      target:'Amigo / Amiga', phonetic:'ah-MEE-goh' },
        { en:'Boy',         target:'Niño',          phonetic:'NEE-nyoh' },
        { en:'Girl',        target:'Niña',          phonetic:'NEE-nyah' }
      ],
      school:[
        { en:'Book',      target:'Libro',      phonetic:'LEE-broh' },
        { en:'Pencil',    target:'Lápiz',      phonetic:'LAH-pees' },
        { en:'Teacher',   target:'Maestro/a',  phonetic:'mah-EHS-troh' },
        { en:'School',    target:'Escuela',    phonetic:'es-KWEH-lah' },
        { en:'Classroom', target:'Aula',       phonetic:'OW-lah' },
        { en:'Chair',     target:'Silla',      phonetic:'SEE-yah' },
        { en:'Table',     target:'Mesa',       phonetic:'MEH-sah' },
        { en:'Bag',       target:'Mochila',    phonetic:'moh-CHEE-lah' },
        { en:'Ruler',     target:'Regla',      phonetic:'REH-glah' },
        { en:'Friend',    target:'Compañero',  phonetic:'kom-pah-NYEH-roh' }
      ]
    }
  },

  french: {
    name:'French', flag:'🇫🇷', nativeName:'Français',
    funFact:'French is spoken on all five continents and is an official language of 29 countries. It\'s the language of love, fashion and cooking!',
    categories:{
      greetings:[
        { en:'Hello',          target:'Bonjour',          phonetic:'bon-ZHOOR' },
        { en:'Good evening',   target:'Bonsoir',          phonetic:'bon-SWAHR' },
        { en:'Good night',     target:'Bonne nuit',       phonetic:'bon NWEE' },
        { en:'Goodbye',        target:'Au revoir',        phonetic:'oh ruh-VWAHR' },
        { en:'Thank you',      target:'Merci',            phonetic:'mer-SEE' },
        { en:'Please',         target:"S'il vous plaît",  phonetic:'seel voo PLAY' },
        { en:'Excuse me',      target:'Excusez-moi',      phonetic:'ex-koo-ZAY mwah' },
        { en:'How are you?',   target:'Comment ça va ?',  phonetic:'ko-mahn sah VAH' },
        { en:'Very well',      target:'Très bien',        phonetic:'treh byan' },
        { en:'My name is...', target:"Je m'appelle...",   phonetic:'zhuh mah-PEL' }
      ],
      numbers:[
        { en:'One',   target:'Un / Une',  phonetic:'uhn / OON' },
        { en:'Two',   target:'Deux',      phonetic:'duh' },
        { en:'Three', target:'Trois',     phonetic:'twah' },
        { en:'Four',  target:'Quatre',    phonetic:'KAH-truh' },
        { en:'Five',  target:'Cinq',      phonetic:'sank' },
        { en:'Six',   target:'Six',       phonetic:'sees' },
        { en:'Seven', target:'Sept',      phonetic:'set' },
        { en:'Eight', target:'Huit',      phonetic:'weet' },
        { en:'Nine',  target:'Neuf',      phonetic:'nuhf' },
        { en:'Ten',   target:'Dix',       phonetic:'dees' }
      ],
      food:[
        { en:'Water',     target:'Eau',        phonetic:'oh' },
        { en:'Bread',     target:'Pain',       phonetic:'pan' },
        { en:'Milk',      target:'Lait',       phonetic:'lay' },
        { en:'Apple',     target:'Pomme',      phonetic:'pom' },
        { en:'Chicken',   target:'Poulet',     phonetic:'poo-LAY' },
        { en:'Cheese',    target:'Fromage',    phonetic:'froh-MAZH' },
        { en:'Egg',       target:'Œuf',        phonetic:'uhf' },
        { en:'Fish',      target:'Poisson',    phonetic:'pwah-SON' },
        { en:'Cake',      target:'Gâteau',     phonetic:'gah-TOH' },
        { en:'Chocolate', target:'Chocolat',   phonetic:'shoh-koh-LAH' }
      ],
      colours:[
        { en:'Red',    target:'Rouge',          phonetic:'roozh' },
        { en:'Blue',   target:'Bleu',           phonetic:'bluh' },
        { en:'Yellow', target:'Jaune',          phonetic:'zhohn' },
        { en:'Green',  target:'Vert / Verte',   phonetic:'vair / vert' },
        { en:'Black',  target:'Noir / Noire',   phonetic:'nwahr' },
        { en:'White',  target:'Blanc / Blanche',phonetic:'blahn / blansh' },
        { en:'Pink',   target:'Rose',           phonetic:'rohz' },
        { en:'Purple', target:'Violet',         phonetic:'vyoh-LAY' },
        { en:'Orange', target:'Orange',         phonetic:'oh-RAHNZH' },
        { en:'Brown',  target:'Marron',         phonetic:'mah-RON' }
      ],
      family:[
        { en:'Mother',      target:'Mère',        phonetic:'mair' },
        { en:'Father',      target:'Père',        phonetic:'pair' },
        { en:'Brother',     target:'Frère',       phonetic:'frair' },
        { en:'Sister',      target:'Sœur',        phonetic:'suhr' },
        { en:'Grandmother', target:'Grand-mère',  phonetic:'grahn-MAIR' },
        { en:'Grandfather', target:'Grand-père',  phonetic:'grahn-PAIR' },
        { en:'Baby',        target:'Bébé',        phonetic:'bay-BAY' },
        { en:'Friend (m)',  target:'Ami',         phonetic:'ah-MEE' },
        { en:'Boy',         target:'Garçon',      phonetic:'gar-SON' },
        { en:'Girl',        target:'Fille',       phonetic:'fee' }
      ],
      school:[
        { en:'Book',      target:'Livre',       phonetic:'lee-vruh' },
        { en:'Pencil',    target:'Crayon',      phonetic:'kreh-YON' },
        { en:'Teacher',   target:'Professeur',  phonetic:'proh-feh-SUHR' },
        { en:'School',    target:'École',       phonetic:'ay-KOL' },
        { en:'Classroom', target:'Classe',      phonetic:'klass' },
        { en:'Chair',     target:'Chaise',      phonetic:'shez' },
        { en:'Table',     target:'Table',       phonetic:'TAH-bluh' },
        { en:'Bag',       target:'Sac',         phonetic:'sak' },
        { en:'Ruler',     target:'Règle',       phonetic:'REH-gluh' },
        { en:'Pen',       target:'Stylo',       phonetic:'stee-LOH' }
      ]
    }
  },

  mandarin: {
    name:'Mandarin Chinese', flag:'🇨🇳', nativeName:'普通话 (Pǔtōnghuà)',
    funFact:'Mandarin is the most spoken language in the world by native speakers — over 900 million people! Chinese characters are over 3,000 years old.',
    categories:{
      greetings:[
        { en:'Hello',            target:'你好 (Nǐ hǎo)',        phonetic:'Nee HOW' },
        { en:'Good morning',     target:'早上好 (Zǎo shang hǎo)',phonetic:'Dzow shung HOW' },
        { en:'Good night',       target:'晚安 (Wǎn ān)',         phonetic:'Wahn AHN' },
        { en:'Goodbye',          target:'再见 (Zàijiàn)',         phonetic:'Dzai JYEN' },
        { en:'Thank you',        target:'谢谢 (Xièxiè)',          phonetic:'Shyeh-SHYEH' },
        { en:'Please',           target:'请 (Qǐng)',              phonetic:'Ching' },
        { en:'Excuse me / Sorry',target:'对不起 (Duìbuqǐ)',       phonetic:'Dway-boo-CHEE' },
        { en:'How are you?',     target:'你好吗？(Nǐ hǎo ma?)',   phonetic:'Nee HOW mah?' },
        { en:'I am fine',        target:'我很好 (Wǒ hěn hǎo)',    phonetic:'Woh hun HOW' },
        { en:'My name is...',   target:'我叫... (Wǒ jiào...)',   phonetic:'Woh JYOW...' }
      ],
      numbers:[
        { en:'One',   target:'一 (Yī)',  phonetic:'Yee' },
        { en:'Two',   target:'二 (Èr)',  phonetic:'Ar' },
        { en:'Three', target:'三 (Sān)', phonetic:'Sahn' },
        { en:'Four',  target:'四 (Sì)',  phonetic:'Suh' },
        { en:'Five',  target:'五 (Wǔ)', phonetic:'Woo' },
        { en:'Six',   target:'六 (Liù)',phonetic:'Lyoh' },
        { en:'Seven', target:'七 (Qī)', phonetic:'Chee' },
        { en:'Eight', target:'八 (Bā)', phonetic:'Bah' },
        { en:'Nine',  target:'九 (Jiǔ)',phonetic:'Jyoh' },
        { en:'Ten',   target:'十 (Shí)',phonetic:'Sher' }
      ],
      food:[
        { en:'Water',    target:'水 (Shuǐ)',        phonetic:'Shway' },
        { en:'Rice',     target:'米饭 (Mǐfàn)',      phonetic:'Mee-FAHN' },
        { en:'Noodles',  target:'面条 (Miàntiáo)',   phonetic:'Myen-TYOW' },
        { en:'Apple',    target:'苹果 (Píngguǒ)',    phonetic:'Ping-GWOH' },
        { en:'Milk',     target:'牛奶 (Niúnǎi)',     phonetic:'Nyoh-NAY' },
        { en:'Chicken',  target:'鸡肉 (Jī ròu)',     phonetic:'Jee ROH' },
        { en:'Egg',      target:'鸡蛋 (Jīdàn)',      phonetic:'Jee DAHN' },
        { en:'Fish',     target:'鱼 (Yú)',           phonetic:'Yoo' },
        { en:'Tea',      target:'茶 (Chá)',          phonetic:'Chah' },
        { en:'Bread',    target:'面包 (Miànbāo)',    phonetic:'Myen-BOW' }
      ],
      colours:[
        { en:'Red',    target:'红色 (Hóng sè)',  phonetic:'Hong SUH' },
        { en:'Blue',   target:'蓝色 (Lán sè)',   phonetic:'Lahn SUH' },
        { en:'Yellow', target:'黄色 (Huáng sè)', phonetic:'Hwang SUH' },
        { en:'Green',  target:'绿色 (Lǜ sè)',   phonetic:'Lyoo SUH' },
        { en:'Black',  target:'黑色 (Hēi sè)',   phonetic:'Hay SUH' },
        { en:'White',  target:'白色 (Bái sè)',   phonetic:'By SUH' },
        { en:'Pink',   target:'粉红 (Fěnhóng)',  phonetic:'Fun-HONG' },
        { en:'Purple', target:'紫色 (Zǐ sè)',    phonetic:'Dzuh SUH' },
        { en:'Orange', target:'橙色 (Chéng sè)', phonetic:'Chung SUH' },
        { en:'Brown',  target:'棕色 (Zōng sè)',  phonetic:'Dzong SUH' }
      ],
      family:[
        { en:'Mother',            target:'妈妈 (Māma)',     phonetic:'Mah-MAH' },
        { en:'Father',            target:'爸爸 (Bàba)',     phonetic:'Bah-BAH' },
        { en:'Older brother',     target:'哥哥 (Gēgē)',     phonetic:'Guh-GUH' },
        { en:'Older sister',      target:'姐姐 (Jiějiě)',   phonetic:'Jyeh-JYEH' },
        { en:'Grandmother (mum side)', target:'外婆 (Wàipó)',phonetic:'Why-POR' },
        { en:'Grandfather (mum side)', target:'外公 (Wàigōng)',phonetic:'Why-GONG' },
        { en:'Baby',              target:'宝宝 (Bǎobao)',   phonetic:'Bow-BOW' },
        { en:'Friend',            target:'朋友 (Péngyǒu)', phonetic:'Pung-YOH' },
        { en:'Boy',               target:'男孩 (Nán hái)', phonetic:'Nahn HY' },
        { en:'Girl',              target:'女孩 (Nǚ hái)',  phonetic:'Nyoo HY' }
      ],
      school:[
        { en:'Book',      target:'书 (Shū)',         phonetic:'Shoo' },
        { en:'Pencil',    target:'铅笔 (Qiānbǐ)',    phonetic:'Chyen-BEE' },
        { en:'Teacher',   target:'老师 (Lǎoshī)',    phonetic:'Lao-SHER' },
        { en:'School',    target:'学校 (Xuéxiào)',   phonetic:'Shweh-SHYOW' },
        { en:'Study',     target:'学习 (Xuéxí)',     phonetic:'Shweh-SHEE' },
        { en:'Write',     target:'写字 (Xiě zì)',    phonetic:'Shyeh-DZUH' },
        { en:'Read',      target:'读书 (Dúshū)',     phonetic:'Doo-SHOO' },
        { en:'Bag',       target:'书包 (Shūbāo)',    phonetic:'Shoo-BOW' },
        { en:'Pen',       target:'钢笔 (Gāngbǐ)',   phonetic:'Gahng-BEE' },
        { en:'Homework',  target:'作业 (Zuòyè)',     phonetic:'Dzwoh-YEH' }
      ]
    }
  },

  yoruba: {
    name:'Yoruba', flag:'🇳🇬', nativeName:'Èdè Yorùbá',
    funFact:'Yoruba is spoken by over 40 million people, mainly in Nigeria, Benin and Togo. It\'s a tonal language — the same word can mean different things depending on how you say it!',
    categories:{
      greetings:[
        { en:'Good morning',   target:'Ẹ káàárọ̀',      phonetic:'Eh KAH-ah-roh' },
        { en:'Good afternoon', target:'Ẹ káàsán',        phonetic:'Eh KAH-ah-sahn' },
        { en:'Good evening',   target:'Ẹ káàlẹ̀',        phonetic:'Eh KAH-ah-leh' },
        { en:'Welcome',        target:'Ẹ káàbọ̀',        phonetic:'Eh KAH-ah-boh' },
        { en:'Thank you',      target:'Ẹ ṣéun',          phonetic:'Eh SHEH-oon' },
        { en:'Please',         target:'Jọwọ',            phonetic:'JOH-woh' },
        { en:'Goodbye',        target:'Ó dàbọ̀',         phonetic:'Oh DAH-boh' },
        { en:'How are you?',   target:'Báwo ni?',        phonetic:'BAH-woh nee?' },
        { en:'I am fine',      target:'Mo wà dáadáa',    phonetic:'Moh WAH dah-DAH' },
        { en:'What is your name?', target:'Kí ni orúkọ rẹ?', phonetic:'Kee nee oh-ROO-koh reh?' }
      ],
      numbers:[
        { en:'One',   target:'Ọ̀kan',    phonetic:'OH-kahn' },
        { en:'Two',   target:'Èjì',     phonetic:'EH-jee' },
        { en:'Three', target:'Ẹ̀ta',    phonetic:'EH-tah' },
        { en:'Four',  target:'Ẹ̀rin',   phonetic:'EH-reen' },
        { en:'Five',  target:'Àrún',    phonetic:'AH-roon' },
        { en:'Six',   target:'Ẹ̀fà',    phonetic:'EH-fah' },
        { en:'Seven', target:'Èje',     phonetic:'EH-jeh' },
        { en:'Eight', target:'Ẹ̀jọ',    phonetic:'EH-joh' },
        { en:'Nine',  target:'Ẹ̀sàn',   phonetic:'EH-sahn' },
        { en:'Ten',   target:'Ẹ̀wá',    phonetic:'EH-wah' }
      ],
      food:[
        { en:'Water',  target:'Omi',       phonetic:'OH-mee' },
        { en:'Food',   target:'Oúnjẹ',     phonetic:'oh-OON-jeh' },
        { en:'Rice',   target:'Ìrẹsì',     phonetic:'ee-REH-see' },
        { en:'Yam',    target:'Iyán',      phonetic:'ee-YAHN' },
        { en:'Bread',  target:'Búrẹ́dì',   phonetic:'boo-REH-dee' },
        { en:'Chicken',target:'Àdìẹ',      phonetic:'AH-dee-eh' },
        { en:'Fish',   target:'Ẹja',       phonetic:'EH-jah' },
        { en:'Soup',   target:'Obẹ̀',      phonetic:'oh-BEH' },
        { en:'Fruit',  target:'Èso',       phonetic:'EH-soh' },
        { en:'Milk',   target:'Wàrà',      phonetic:'WAH-rah' }
      ],
      colours:[
        { en:'Red',    target:'Pupa',          phonetic:'POO-pah' },
        { en:'Blue',   target:'Àwọ̀ ọ̀run',    phonetic:'AH-woh OH-roon' },
        { en:'Yellow', target:'Àwo àgbàdo',    phonetic:'AH-woh ah-BAH-doh' },
        { en:'Green',  target:'Ewé / Àwọ̀ ewé',phonetic:'EH-weh' },
        { en:'Black',  target:'Dúdú',          phonetic:'DOO-doo' },
        { en:'White',  target:'Funfun',        phonetic:'FOON-foon' },
        { en:'Gold',   target:'Wúrà',          phonetic:'WOO-rah' },
        { en:'Brown',  target:'Àwo ilẹ̀',      phonetic:'AH-woh EE-leh' },
        { en:'Pink',   target:'Àwọ̀ òdòdó',    phonetic:'AH-woh oh-DOH-doh' },
        { en:'Purple', target:'Àwọ̀ àjàrà',    phonetic:'AH-woh ah-JAH-rah' }
      ],
      family:[
        { en:'Mother',      target:'Ìyá',         phonetic:'ee-YAH' },
        { en:'Father',      target:'Bàbá',         phonetic:'BAH-bah' },
        { en:'Older sibling',target:'Ẹgbọn',       phonetic:'EH-gbohn' },
        { en:'Younger sibling',target:'Àbúrò',     phonetic:'ah-BOO-roh' },
        { en:'Grandmother', target:'Ìyá àgbà',    phonetic:'ee-YAH AHG-bah' },
        { en:'Grandfather', target:'Bàbá àgbà',   phonetic:'BAH-bah AHG-bah' },
        { en:'Child',       target:'Ọmọ',          phonetic:'OH-moh' },
        { en:'Friend',      target:'Ọ̀rẹ́',         phonetic:'oh-REH' },
        { en:'Family',      target:'Ìdílé',        phonetic:'ee-DEE-leh' },
        { en:'Baby',        target:'Ọmọ ikọ́lé',   phonetic:'OH-moh ee-KOH-leh' }
      ],
      school:[
        { en:'School',     target:'Ilé-ẹ̀kọ́',    phonetic:'ee-LEH eh-KOH' },
        { en:'Book',       target:'Ìwé',          phonetic:'ee-WEH' },
        { en:'Teacher',    target:'Olùkọ́',        phonetic:'oh-LOO-koh' },
        { en:'Student',    target:'Akẹ́kọ̀ọ́',     phonetic:'ah-KEH-koh-oh' },
        { en:'Write',      target:'Kọ',           phonetic:'KOH' },
        { en:'Read',       target:'Ka',           phonetic:'KAH' },
        { en:'Learn',      target:'Kọ́ ẹ̀kọ́',     phonetic:'KOH eh-KOH' },
        { en:'Pencil',     target:'Pẹ́ńsẹ́lì',    phonetic:'PEN-seh-lee' },
        { en:'Bag',        target:'Àpò',          phonetic:'AH-poh' },
        { en:'Classroom',  target:'Yàrá ẹ̀kọ́',  phonetic:'YAH-rah EH-koh' }
      ]
    }
  }
};
