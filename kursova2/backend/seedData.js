import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Book from './models/Book.js';
import Order from './models/Order.js';

dotenv.config();

// Усі обкладинки лежать локально у frontend/public/images/books/
// тому вони завжди завантажуються (без зовнішніх посилань на Wikipedia тощо).
const books = [
  // ===== Художня література =====
  {
    title: 'Тіні забутих предків',
    author: 'Михайло Коцюбинський',
    category: 'Художня література',
    image: '/images/books/tini.jpg',
    description: 'Повість про трагічне кохання Івана та Марічки на тлі гуцульського побуту Карпат. Твір пронизаний ліризмом, містикою та глибоким відчуттям природи.',
    price: 240, discount: 10, stock: 25, pages: 120,
    publisher: 'Видавництво Старого Лева'
  },
  {
    title: 'Дюна',
    author: 'Френк Герберт',
    category: 'Художня література',
    image: '/images/books/duna.jpg',
    description: 'Культовий науково-фантастичний роман про боротьбу за пустельну планету Арракіс — єдине джерело найціннішої речовини у Всесвіті, прянощів.',
    price: 520, discount: 0, stock: 18, pages: 656,
    publisher: 'Клуб сімейного дозвілля'
  },
  {
    title: 'Інтернат',
    author: 'Сергій Жадан',
    category: 'Художня література',
    image: '/images/books/internat.jpg',
    description: 'Роман про вчителя, який під час війни на сході вирушає визволяти племінника з інтернату. Три дні дороги крізь зруйноване й розгублене місто.',
    price: 290, discount: 5, stock: 20, pages: 336,
    publisher: 'Meridian Czernowitz'
  },
  {
    title: '1984',
    author: 'Джордж Орвелл',
    category: 'Художня література',
    image: '/images/books/1984.jpg',
    description: 'Антиутопія про тоталітарне суспільство тотального контролю, де Старший Брат стежить за кожним, а правда переписується щодня.',
    price: 260, discount: 15, stock: 30, pages: 312,
    publisher: 'Видавництво Жупанського'
  },
  {
    title: 'Майстер і Маргарита',
    author: 'Михайло Булгаков',
    category: 'Художня література',
    image: '/images/books/master.jpg',
    description: 'Філософський роман, у якому до Москви прибуває сам диявол зі свитою. Сатира, містика та вічна історія кохання Майстра й Маргарити.',
    price: 320, discount: 0, stock: 15, pages: 416,
    publisher: 'Видавництво «Кальварія»'
  },
  {
    title: 'Колекціонер',
    author: 'Джон Фаулз',
    category: 'Художня література',
    image: '/images/books/collector.jpg',
    description: 'Психологічний трилер про самотнього колекціонера метеликів, який викрадає дівчину, щоб додати її до своєї «колекції».',
    price: 270, discount: 10, stock: 16, pages: 304,
    publisher: 'Клуб сімейного дозвілля'
  },
  {
    title: 'Гра престолів',
    author: 'Джордж Р. Р. Мартін',
    category: 'Художня література',
    image: '/images/books/got.jpg',
    description: 'Перша книга саги «Пісня льоду й полум’я». Боротьба знатних родів за Залізний трон Семи Королівств, де зима триватиме роками.',
    price: 480, discount: 0, stock: 12, pages: 800,
    publisher: 'КМ-Букс'
  },
  {
    title: 'Хіба ревуть воли, як ясла повні?',
    author: 'Панас Мирний',
    category: 'Художня література',
    image: '/images/books/voly.jpg',
    description: 'Соціально-психологічний роман про шлях українського селянина Чіпки від правдошукача до розбійника на тлі пореформеного села.',
    price: 210, discount: 0, stock: 28, pages: 432,
    publisher: 'Фоліо'
  },
  {
    title: 'Місто',
    author: 'Валер’ян Підмогильний',
    category: 'Художня література',
    image: '/images/books/misto.jpg',
    description: 'Урбаністичний роман про молодого селянина Степана Радченка, який приїжджає до Києва підкорювати місто та власні амбіції.',
    price: 230, discount: 5, stock: 22, pages: 336,
    publisher: 'Видавництво Старого Лева'
  },

  // ===== Наукова література =====
  {
    title: 'Коротка історія часу',
    author: 'Стівен Гокінг',
    category: 'Наукова література',
    image: '/images/books/time.png',
    description: 'Бестселер про чорні діри, Великий вибух, природу часу й будову Всесвіту, написаний доступною мовою для широкого читача.',
    price: 350, discount: 0, stock: 14, pages: 256,
    publisher: 'Клуб сімейного дозвілля'
  },
  {
    title: 'Чому нації занепадають',
    author: 'Дарон Аджемоглу, Джеймс Робінсон',
    category: 'Наукова література',
    image: '/images/books/nations.jpg',
    description: 'Дослідження про те, чому одні країни багаті, а інші бідні. Автори доводять, що ключ — у політичних та економічних інституціях.',
    price: 420, discount: 10, stock: 11, pages: 440,
    publisher: 'Наш формат'
  },
  {
    title: 'Чорний лебідь',
    author: 'Нассім Ніколас Талеб',
    category: 'Наукова література',
    image: '/images/books/blackswan.jpg',
    description: 'Про вплив малоймовірних, але надзвичайно значущих подій на історію, економіку та наше життя — і чому ми їх постійно недооцінюємо.',
    price: 390, discount: 0, stock: 13, pages: 392,
    publisher: 'Наш формат'
  },

  // ===== Дитячі книги =====
  {
    title: 'Гаррі Поттер і філософський камінь',
    author: 'Джоан Ролінг',
    category: 'Дитячі книги',
    image: '/images/books/hp1.jpg',
    description: 'Перша книга про хлопчика-чарівника, який дізнається, що він не звичайний сирота, і вступає до школи чаклунства Гоґвортс.',
    price: 330, discount: 0, stock: 35, pages: 320,
    publisher: 'А-БА-БА-ГА-ЛА-МА-ГА'
  },
  {
    title: 'Гаррі Поттер і таємна кімната',
    author: 'Джоан Ролінг',
    category: 'Дитячі книги',
    image: '/images/books/hp2.jpg',
    description: 'Другий рік навчання у Гоґвортсі. Хтось відчиняє Таємну кімнату, і школу охоплює жах — учні кам’яніють один за одним.',
    price: 340, discount: 5, stock: 30, pages: 352,
    publisher: 'А-БА-БА-ГА-ЛА-МА-ГА'
  },
  {
    title: 'Чарлі і шоколадна фабрика',
    author: 'Роальд Дал',
    category: 'Дитячі книги',
    image: '/images/books/charlie.png',
    description: 'Бідний хлопчик Чарлі виграє золотий квиток і потрапляє на дивовижну шоколадну фабрику ексцентричного містера Вонки.',
    price: 220, discount: 0, stock: 40, pages: 240,
    publisher: 'А-БА-БА-ГА-ЛА-МА-ГА'
  },
  {
    title: 'Тореадори з Васюківки',
    author: 'Всеволод Нестайко',
    category: 'Дитячі книги',
    image: '/images/books/toreadory.jpg',
    description: 'Веселі та неймовірні пригоди двох нерозлучних друзів — Яви й Павлуші — із села Васюківка. Класика української дитячої літератури.',
    price: 250, discount: 0, stock: 26, pages: 544,
    publisher: 'Веселка'
  },
  {
    title: 'Мавка. Лісова пісня',
    author: 'За мотивами Лесі Українки',
    category: 'Дитячі книги',
    image: '/images/books/mavka.png',
    description: 'Яскрава ілюстрована історія кохання лісової мавки та сільського музики Лукаша — за мотивами анімаційного фільму та драми-феєрії.',
    price: 290, discount: 15, stock: 20, pages: 64,
    publisher: 'ArtBooks'
  },

  // ===== Комікси =====
  {
    title: 'Персеполіс',
    author: 'Маржан Сатрапі',
    category: 'Комікси',
    image: '/images/books/persepolis.jpg',
    description: 'Автобіографічний графічний роман про дитинство авторки в Ірані під час Ісламської революції та війни. Чорно-білий, щирий і пронизливий.',
    price: 360, discount: 0, stock: 10, pages: 360,
    publisher: 'Видавництво'
  },
  {
    title: 'Маус',
    author: 'Арт Шпіґельман',
    category: 'Комікси',
    image: '/images/books/maus.jpg',
    description: 'Графічний роман про Голокост, де євреї зображені мишами, а нацисти — котами. Єдиний комікс, що отримав Пулітцерівську премію.',
    price: 420, discount: 5, stock: 9, pages: 296,
    publisher: 'Видавництво'
  },
  {
    title: 'Вартові',
    author: 'Алан Мур',
    category: 'Комікси',
    image: '/images/books/watchmen.png',
    description: 'Культовий графічний роман, що переосмислює жанр супергероїки. Альтернативна історія, де герої поза законом розслідують убивство колеги.',
    price: 540, discount: 10, stock: 8, pages: 416,
    publisher: 'Рідна мова'
  },
  {
    title: 'Бетмен: Убивчий жарт',
    author: 'Алан Мур',
    category: 'Комікси',
    image: '/images/books/batman.png',
    description: 'Одна з найвідоміших історій про протистояння Бетмена та Джокера. Похмура психологічна драма про межу між героєм і лиходієм.',
    price: 280, discount: 0, stock: 12, pages: 64,
    publisher: 'Рідна мова'
  },

  // ===== Навчальна література =====
  {
    title: 'Атомні звички',
    author: 'Джеймс Клір',
    category: 'Навчальна література',
    image: '/images/books/atomic.jpg',
    description: 'Практичний посібник про те, як незначні щоденні зміни приводять до значних результатів. Перевірена система формування корисних звичок.',
    price: 310, discount: 10, stock: 24, pages: 320,
    publisher: 'Клуб сімейного дозвілля'
  },
  {
    title: '7 звичок надзвичайно ефективних людей',
    author: 'Стівен Кові',
    category: 'Навчальна література',
    image: '/images/books/7habits.jpg',
    description: 'Класика літератури з саморозвитку. Сім принципів особистої та професійної ефективності, перевірених мільйонами читачів у всьому світі.',
    price: 330, discount: 0, stock: 18, pages: 384,
    publisher: 'КМ-Букс'
  },
  {
    title: 'Як здобувати друзів і впливати на людей',
    author: 'Дейл Карнегі',
    category: 'Навчальна література',
    image: '/images/books/carnegie.jpg',
    description: 'Найвідоміший посібник зі спілкування та психології стосунків. Поради, що допомагають порозумітися з людьми та впливати на них.',
    price: 270, discount: 5, stock: 21, pages: 352,
    publisher: 'Клуб сімейного дозвілля'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB підключено для seed...');

    await User.deleteMany({});
    await Book.deleteMany({});
    await Order.deleteMany({});
    console.log('Базу очищено');

    await User.create({ name: 'Admin', email: 'admin@litera.com', password: 'admin123', role: 'admin' });
    await User.create({ name: 'Test User', email: 'user@litera.com', password: 'user123', role: 'user' });
    console.log('Створено користувачів: admin@litera.com / admin123  та  user@litera.com / user123');

    await Book.insertMany(books);
    console.log('Додано ' + books.length + ' книг з обкладинками!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Помилка seed:', error.message);
    process.exit(1);
  }
};

seedDB();
