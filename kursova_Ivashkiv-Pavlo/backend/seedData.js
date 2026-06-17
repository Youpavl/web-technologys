import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book.js';

dotenv.config();

// Одноразове наповнення бази (npm run seed). Обкладинки - у frontend/public/images/books/
const books = [
  // ===== Художня література =====
  { title: 'Тіні забутих предків', category: 'Художня література', image: '/images/books/tini.jpg',
    description: 'Повість про трагічне кохання Івана та Марічки на тлі гуцульського побуту Карпат. Михайло Коцюбинський.',
    price: 240, discount: 10, stock: 25 },
  { title: 'Дюна', category: 'Художня література', image: '/images/books/duna.jpg',
    description: 'Культовий науково-фантастичний роман про боротьбу за пустельну планету Арракіс. Френк Герберт.',
    price: 520, discount: 0, stock: 18 },
  { title: 'Інтернат', category: 'Художня література', image: '/images/books/internat.jpg',
    description: 'Роман про вчителя, який під час війни вирушає визволяти племінника з інтернату. Сергій Жадан.',
    price: 290, discount: 5, stock: 20 },
  { title: '1984', category: 'Художня література', image: '/images/books/1984.jpg',
    description: 'Антиутопія про тоталітарне суспільство тотального контролю. Джордж Орвелл.',
    price: 260, discount: 15, stock: 30 },
  { title: 'Майстер і Маргарита', category: 'Художня література', image: '/images/books/master.jpg',
    description: 'Філософський роман, у якому до Москви прибуває сам диявол зі свитою. Михайло Булгаков.',
    price: 320, discount: 0, stock: 15 },
  { title: 'Колекціонер', category: 'Художня література', image: '/images/books/collector.jpg',
    description: 'Психологічний трилер про колекціонера метеликів, який викрадає дівчину. Джон Фаулз.',
    price: 270, discount: 10, stock: 16 },
  { title: 'Гра престолів', category: 'Художня література', image: '/images/books/got.jpg',
    description: 'Перша книга саги «Пісня льоду й полум’я». Боротьба родів за Залізний трон. Джордж Р. Р. Мартін.',
    price: 480, discount: 0, stock: 12 },
  { title: 'Місто', category: 'Художня література', image: '/images/books/misto.jpg',
    description: 'Урбаністичний роман про молодого селянина, який приїжджає підкорювати Київ. Валер’ян Підмогильний.',
    price: 230, discount: 5, stock: 22 },

  // ===== Наукова література =====
  { title: 'Коротка історія часу', category: 'Наукова література', image: '/images/books/time.png',
    description: 'Бестселер про чорні діри, Великий вибух та будову Всесвіту доступною мовою. Стівен Гокінг.',
    price: 350, discount: 0, stock: 14 },
  { title: 'Чому нації занепадають', category: 'Наукова література', image: '/images/books/nations.jpg',
    description: 'Дослідження про те, чому одні країни багаті, а інші бідні. Аджемоглу та Робінсон.',
    price: 420, discount: 10, stock: 11 },
  { title: 'Чорний лебідь', category: 'Наукова література', image: '/images/books/blackswan.jpg',
    description: 'Про вплив малоймовірних, але значущих подій на історію та економіку. Нассім Талеб.',
    price: 390, discount: 0, stock: 13 },

  // ===== Дитячі книги =====
  { title: 'Гаррі Поттер і філософський камінь', category: 'Дитячі книги', image: '/images/books/hp1.jpg',
    description: 'Перша книга про хлопчика-чарівника, який вступає до школи чаклунства Гоґвортс. Джоан Ролінг.',
    price: 330, discount: 0, stock: 35 },
  { title: 'Гаррі Поттер і таємна кімната', category: 'Дитячі книги', image: '/images/books/hp2.jpg',
    description: 'Другий рік навчання у Гоґвортсі: хтось відчиняє Таємну кімнату. Джоан Ролінг.',
    price: 340, discount: 5, stock: 30 },
  { title: 'Чарлі і шоколадна фабрика', category: 'Дитячі книги', image: '/images/books/charlie.png',
    description: 'Бідний хлопчик Чарлі потрапляє на дивовижну шоколадну фабрику містера Вонки. Роальд Дал.',
    price: 220, discount: 0, stock: 40 },
  { title: 'Тореадори з Васюківки', category: 'Дитячі книги', image: '/images/books/toreadory.jpg',
    description: 'Веселі пригоди двох нерозлучних друзів із села Васюківка. Всеволод Нестайко.',
    price: 250, discount: 0, stock: 26 },
  { title: 'Мавка. Лісова пісня', category: 'Дитячі книги', image: '/images/books/mavka.png',
    description: 'Ілюстрована історія кохання лісової мавки та музики Лукаша. За мотивами Лесі Українки.',
    price: 290, discount: 15, stock: 20 },

  // ===== Комікси =====
  { title: 'Персеполіс', category: 'Комікси', image: '/images/books/persepolis.jpg',
    description: 'Автобіографічний графічний роман про дитинство в Ірані під час революції. Маржан Сатрапі.',
    price: 360, discount: 0, stock: 10 },
  { title: 'Маус', category: 'Комікси', image: '/images/books/maus.jpg',
    description: 'Графічний роман про Голокост — єдиний комікс, що отримав Пулітцерівську премію. Арт Шпіґельман.',
    price: 420, discount: 5, stock: 9 },
  { title: 'Вартові', category: 'Комікси', image: '/images/books/watchmen.png',
    description: 'Культовий графічний роман, що переосмислює жанр супергероїки. Алан Мур.',
    price: 540, discount: 10, stock: 8 },
  { title: 'Бетмен: Убивчий жарт', category: 'Комікси', image: '/images/books/batman.png',
    description: 'Одна з найвідоміших історій про протистояння Бетмена та Джокера. Алан Мур.',
    price: 280, discount: 0, stock: 12 },

  // ===== Навчальна література =====
  { title: 'Атомні звички', category: 'Навчальна література', image: '/images/books/atomic.jpg',
    description: 'Практичний посібник про те, як незначні щоденні зміни приводять до значних результатів. Джеймс Клір.',
    price: 310, discount: 10, stock: 24 },
  { title: '7 звичок надзвичайно ефективних людей', category: 'Навчальна література', image: '/images/books/7habits.jpg',
    description: 'Класика літератури з саморозвитку: сім принципів особистої ефективності. Стівен Кові.',
    price: 330, discount: 0, stock: 18 },
  { title: 'Як здобувати друзів і впливати на людей', category: 'Навчальна література', image: '/images/books/carnegie.jpg',
    description: 'Найвідоміший посібник зі спілкування та психології стосунків. Дейл Карнегі.',
    price: 270, discount: 5, stock: 21 },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB підключено для seed...');

    // Спершу чищу стару колекцію, щоб не було дублів
    await Book.deleteMany({});
    console.log('Стару колекцію книг очищено');

    await Book.insertMany(books);
    console.log(`Додано ${books.length} книг з обкладинками!`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Помилка seed:', error.message);
    process.exit(1);
  }
};

seedDB();
