/**
 * scripts/seed.js — Seeds the database with an admin user and sample articles.
 * Run once: node scripts/seed.js
 * ⚠️  This will DELETE existing admins and articles before seeding.
 */

'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Article = require('../models/Article');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'ashir';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AshirRana@002';

const sampleArticles = [
  {
    title: 'The Art of Writing Simply',
    description:
      'Why the clearest writing is always the hardest — and how stripping away complexity unlocks meaning.',
    content: `<h2>Less Is More</h2>
<p>Every sentence you write should earn its place. The greatest writers weren't those who used the most words — they were the ones who found exactly the right ones.</p>
<p>George Orwell once said that good writing is like a pane of glass: you don't notice it; you see through it to the truth beyond. That transparency is incredibly difficult to achieve.</p>
<h2>The First Draft Is Always Wrong</h2>
<p>Your first draft is you telling yourself the story. The second draft is you telling it to the reader. Most writers never get to the second draft — they polish their first-draft habits and call it done.</p>
<p>Here are the questions I ask every paragraph:</p>
<ul>
  <li>Can I say this in half the words?</li>
  <li>What is the one thing this paragraph needs to do?</li>
  <li>Would a reader unfamiliar with my world understand this?</li>
</ul>
<h2>Simplicity Is Not Dumbing Down</h2>
<p>There is a persistent myth that complex ideas require complex language. The opposite is true. If you cannot explain your idea simply, you haven't understood it yet.</p>
<blockquote><p>"The most valuable of all talents is that of never using two words when one will do." — Thomas Jefferson</p></blockquote>
<p>Write simply. Revise ruthlessly. Let the idea carry the weight — not the words.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
    tags: ['writing', 'craft', 'style'],
  },
  {
    title: 'On Reading Slowly in a Fast World',
    description:
      'In an age of skimming and scrolling, the radical act of reading a page twice.',
    content: `<h2>The Speed Epidemic</h2>
<p>We have been trained to consume. Articles optimized for seven-minute reads. Books summarized into ten bullet points. Podcasts played at 2x speed so we can absorb more while absorbing less.</p>
<p>I used to be proud of how many books I finished in a year. Then I realized I could barely remember half of them.</p>
<h2>What Slow Reading Does to You</h2>
<p>When you read slowly, you begin to notice things. The rhythm of a sentence. The deliberate choice of one word over another. The moment a writer is bluffing versus the moment they've truly earned their point.</p>
<p>Reading slowly is not inefficiency — it is intimacy. You are sitting with a mind that spent years building something. The least you can do is be present.</p>
<h2>A Simple Practice</h2>
<p>Pick one book. Read it with a pencil. Underline things that surprise you. Write one sentence in the margin of every chapter: <em>what did this section do to me?</em></p>
<p>At the end of the book, read only your underlines. You will have built a second, private book inside the first one — your dialogue with the author.</p>
<p>That dialogue is the whole point.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
    tags: ['reading', 'habits', 'focus'],
  },
  {
    title: 'Why Every Writer Needs a Commonplace Book',
    description:
      'The centuries-old practice that turns scattered notes into a creative engine.',
    content: `<h2>What Is a Commonplace Book?</h2>
<p>For centuries, writers, scientists, and thinkers kept what they called a "commonplace book" — a personal collection of quotes, observations, and ideas gathered from everything they read and experienced.</p>
<p>Francis Bacon kept one. Marcus Aurelius' <em>Meditations</em> is essentially one. Thomas Jefferson filled dozens of them.</p>
<h2>The Problem It Solves</h2>
<p>Ideas are slippery. You read something brilliant, feel it lodge somewhere meaningful in your mind, and then — two weeks later — it's gone. Not the vague feeling it left, but the precise formulation that made it true.</p>
<p>A commonplace book is a net for ideas. You throw it over everything you read and capture what is worth keeping.</p>
<h2>How to Start One Today</h2>
<p>You don't need a special notebook. You need a system with two rules:</p>
<ul>
  <li><strong>Capture</strong> — write down anything that surprises, provokes, or resonates. The source, the date, and a one-sentence note on why it matters to you.</li>
  <li><strong>Review</strong> — read through your entries once a month. Connections will appear between ideas you captured weeks apart.</li>
</ul>
<p>Those connections are where original thinking lives. Not in any single entry — in the space between them.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800',
    tags: ['productivity', 'writing', 'knowledge'],
  },
];

async function seed() {
  console.log('🌱  Starting database seed...\n');

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅  Connected to MongoDB.');

  // Clear existing data
  await Admin.deleteMany({});
  await Article.deleteMany({});
  console.log('🗑️   Cleared existing admins and articles.');

  // Create admin user
  const admin = await Admin.create({
    username: ADMIN_USERNAME,
    password: ADMIN_PASSWORD,
  });
  console.log(`👤  Admin created — username: "${admin.username}"`);

  // Create sample articles
  for (const data of sampleArticles) {
    const article = await Article.create(data);
    console.log(`📄  Article created — "${article.title}" (slug: ${article.slug})`);
  }

  console.log('\n✅  Seed complete!');
  console.log('─'.repeat(50));
  console.log(`Admin Panel URL : /admin-secret-panel`);
  console.log(`Username        : ${ADMIN_USERNAME}`);
  console.log(`Password        : ${ADMIN_PASSWORD}`);
  console.log('─'.repeat(50));
  console.log('⚠️   Change the admin password before going to production.\n');

  process.exit(0);
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
