const { User, Movie } = require('./models');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    console.log('Starting data seeding...');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const admin = await User.findOrCreate({
      where: { email: 'admin@flyxo.com' },
      defaults: {
        name: 'Admin User',
        email: 'admin@flyxo.com',
        password: adminPassword,
        phone: '9876543210',
        age: 30,
        role: 'admin'
      }
    });

    const testUser = await User.findOrCreate({
      where: { email: 'user@test.com' },
      defaults: {
        name: 'Test User',
        email: 'user@test.com',
        password: userPassword,
        phone: '9876543211',
        age: 25,
        role: 'user'
      }
    });

    const sampleMovies = [
      {
        title: 'The Epic Adventure',
        description: 'An epic journey through uncharted territories filled with danger, excitement, and breathtaking landscapes. Follow our heroes as they embark on a quest to save their world.',
        genre: 'Action',
        duration: 150,
        language: 'English',
        rating: 'UA',
        minimumAge: 13,
        thumbnail: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
        releaseDate: new Date('2024-01-15')
      },
      {
        title: 'Love in Paris',
        description: 'A heartwarming romantic tale set in the beautiful streets of Paris. Two strangers meet by chance and discover that fate has bigger plans for them.',
        genre: 'Romance',
        duration: 125,
        language: 'English',
        rating: 'U',
        minimumAge: 0,
        thumbnail: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
        releaseDate: new Date('2024-02-14')
      },
      {
        title: 'Space Odyssey 2099',
        description: 'In a distant future, humanity must travel to the far reaches of space to find a new home. A thrilling sci-fi adventure with stunning visual effects.',
        genre: 'Sci-Fi',
        duration: 165,
        language: 'English',
        rating: 'UA',
        minimumAge: 13,
        thumbnail: 'https://images.pexels.com/photos/2007647/pexels-photo-2007647.jpeg',
        releaseDate: new Date('2024-03-01')
      },
      {
        title: 'The Comedy Club',
        description: 'A hilarious comedy about a group of friends trying to save their favorite comedy club from closing down. Featuring non-stop laughs and heartfelt moments.',
        genre: 'Comedy',
        duration: 110,
        language: 'Hindi',
        rating: 'U',
        minimumAge: 0,
        thumbnail: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg',
        releaseDate: new Date('2024-01-20')
      },
      {
        title: 'Dark Secrets',
        description: 'A psychological thriller that will keep you on the edge of your seat. Nothing is as it seems in this twisted tale of deception and mystery.',
        genre: 'Thriller',
        duration: 135,
        language: 'English',
        rating: 'A',
        minimumAge: 18,
        thumbnail: 'https://images.pexels.com/photos/1279830/pexels-photo-1279830.jpeg',
        releaseDate: new Date('2024-02-01')
      },
      {
        title: 'The Last Stand',
        description: 'An intense action-packed drama about a group of soldiers making their last stand against overwhelming odds. Courage, sacrifice, and honor define this epic tale.',
        genre: 'Action',
        duration: 140,
        language: 'English',
        rating: 'A',
        minimumAge: 18,
        thumbnail: 'https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg',
        releaseDate: new Date('2024-02-20')
      }
    ];

    for (const movieData of sampleMovies) {
      await Movie.findOrCreate({
        where: { title: movieData.title },
        defaults: movieData
      });
    }

    console.log('Data seeding completed successfully!');
    console.log('\nDefault Credentials:');
    console.log('Admin - Email: admin@flyxo.com, Password: admin123');
    console.log('User - Email: user@test.com, Password: user123');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedData;

if (require.main === module) {
  const { connectDB } = require('./config/database');
  connectDB().then(() => {
    seedData().then(() => process.exit(0));
  });
}
