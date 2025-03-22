/**
 * Seed script to populate the database with sample contributions for existing stories
 * 
 * Usage: 
 * 1. Make sure MongoDB is running
 * 2. Run this script with: node src/scripts/seedContributions.js
 * 3. Run this after running seedStories.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Story = require('../models/storyModel');
const User = require('../models/userModel');
const Contribution = require('../models/contributionModel');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Sample contributions for different story genres
const sampleContributions = {
  'Adventure': [
    "The team of archaeologists gathered their equipment as the sun rose over the horizon. Dr. Sarah Chen, the lead archaeologist, checked her underwater breathing apparatus one last time before addressing the group. 'Remember, we're looking for evidence, not treasure. The legends of Atlantis have persisted for thousands of years, but we need scientific proof.'",
    "As they descended into the depths, the water grew darker and colder. Their powerful lights cut through the murky blue, revealing a massive stone structure partially buried in the sand. 'This architecture doesn't match any known ancient civilization,' whispered Dr. Chen through the communication system. 'These markings... they're unlike anything I've ever seen.'",
    "Marcus, the team's historian, swam closer to examine the strange symbols etched into the stone. 'They seem to be telling a story,' he said, tracing his fingers along the carvings. Suddenly, the symbols began to glow with an eerie blue light. The team watched in astonishment as the stone wall slowly started to move, revealing a hidden passage that had remained sealed for millennia."
  ],
  'Science Fiction': [
    "Dr. Eliza Morgan wiped the sweat from her brow as she made the final adjustments to her invention. The Chronowave Detector, as she called it, was designed to pick up quantum echoes from future events. According to her calculations, time wasn't as linear as most believed—it rippled, and those ripples could be detected with the right equipment.",
    "The first test was modest in scope. She expected to hear echoes from perhaps a few hours into the future—traffic patterns, weather changes, nothing dramatic. But when she activated the device, the laboratory was filled with sounds of panic, sirens, and what could only be described as the rumble of collapsing buildings. The timestamp on the readings: exactly six months from today.",
    "Government officials were skeptical when Dr. Morgan presented her findings, but the precision of her predictions over the next few days—a surprise election result, a stock market fluctuation, even a surprise sports upset—convinced them to take her seriously. 'Whatever is coming,' she told the emergency committee, 'we have exactly 182 days to prevent it.'"
  ],
  'Horror': [
    "The Millers had been in their new Victorian home for just three days when they first heard it—a soft, indistinct whispering coming from somewhere above their bedroom. Thomas Miller assured his wife and children it was just the old house settling, or perhaps mice in the attic. But deep down, he knew mice didn't whisper names.",
    "Emma, the youngest Miller child, was the first to see the shadow figure at the top of the attic stairs. 'He's sad,' she told her mother matter-of-factly at breakfast. 'He says his family forgot him, and now he's trapped.' When asked who she was talking about, Emma pointed to the empty space beside her. 'My new friend from the attic. He's standing right there.'",
    "Thomas finally gathered the courage to investigate the attic after finding his wife sleepwalking up the stairs for the third night in a row. The air was thick with dust and the smell of decay as he pushed open the creaking door. His flashlight beam cut through the darkness, illuminating the far wall where, to his horror, he saw hundreds of names scratched into the wood—and at the bottom, in fresh markings, the names of his wife and children. His own name was half-finished."
  ],
  'Mystery': [
    "Detective James Blackwood had sworn he would never return to active duty after the 'Riverside Strangler' case nearly destroyed him. Seven victims, all with the same signature method, and the killer had vanished without a trace. That was fifteen years ago. Now, as he stared down at the body on the rain-soaked pavement, the same distinctive ligature marks around the victim's neck, he knew his retirement was over.",
    "The new murders followed the same pattern, but with an added detail—each victim was found with a newspaper clipping about one of the original murders. 'It's like he's recreating his greatest hits,' said Officer Tanya Rodriguez, who had been assigned as Blackwood's partner despite his protests. 'Or someone is copying his work very, very carefully.'",
    "Blackwood's investigation led him to the daughter of the fifth victim from the original case. Now an adult, she had been studying criminology and had written her thesis on the Riverside Strangler. 'I've been expecting you,' she said when he knocked on her door. 'I knew you'd come when it started again. There's something about the case files that nobody ever noticed—something that points directly to someone in your old department.'"
  ],
  'Romance': [
    "Olivia hadn't planned on being stranded in Pine Ridge, a town so small it barely registered on maps. But when her car skidded off the icy mountain road, and the forecast promised three more days of heavy snow, she resigned herself to waiting it out. The only accommodation in town was a small bed and breakfast run by a gruff, bearded man named Jack, who seemed less than thrilled to have a guest.",
    "As days passed, Olivia discovered that Jack had once been a renowned chef in New York City before abruptly leaving it all behind three years ago. When the power went out on the second night, they found themselves sharing stories by firelight, and Jack revealed the tragedy that had sent him seeking solitude in the mountains—the same tragedy that Olivia, a grief counselor, had written a book about, though she didn't tell him that.",
    "On the morning the roads were finally cleared, Olivia found herself reluctant to leave. Over just a few days, the small town and its reluctant host had begun to feel like home in a way that her apartment in the city never had. As she packed her bags, Jack appeared at her door with two cups of coffee and an unexpected question: 'What if you stayed just one more day?'"
  ],
  'Fantasy': [
    "In the kingdom of Eldoria, where dragons and humans had maintained an uneasy peace for centuries, young Finn had always been an outsider. Orphaned during a border skirmish and raised by the village healer, he had a strange affinity for fire that made the other villagers nervous. On his sixteenth birthday, as tradition dictated, he climbed the mountain to offer a gift to the dragons—a gesture of continued peace.",
    "What no one expected was for Kaelith, the eldest and most powerful of all dragons, to descend from her cave and speak directly to Finn. 'You carry the old magic in your blood,' she said, her voice like thunder in his mind. 'You will be my apprentice, the first human to learn dragon magic in a thousand years.' The village elders protested, but Kaelith's word was law on the mountain.",
    "Finn's training with Kaelith revealed secrets about his own past—his parents had not been simple farmers as he'd been told, but dragon-speakers, diplomats between the two species who had been killed not in a random skirmish, but by those who wished to reignite the ancient war. 'There are forces moving against both our kinds,' Kaelith told him as they watched dark clouds gathering on the horizon. 'And you, young one, may be the only one who can stand against them.'"
  ],
  'Comedy': [
    "Max had been doing stand-up comedy for seven years with minimal success. His jokes were decent, but he never quite connected with the audience. That changed the night he found an old, leather-bound notebook in a pawn shop with 'GUARANTEED LAUGHS' embossed on the cover. Thinking it might contain some classic joke structures, he bought it for five dollars.",
    "The first time Max read a joke from the notebook on stage, the audience didn't just laugh—they howled with uncontrollable mirth. People fell out of their chairs, tears streaming down their faces. His social media following exploded overnight, and within weeks, he had a viral video and offers for national tours. The only strange thing was that he couldn't remember the jokes after he told them, and audience members, while raving about how funny he was, couldn't recall the specific jokes either.",
    "Max's meteoric rise caught the attention of Eliza, a graduate student researching the psychology of humor. After attending three of his shows and experiencing the strange amnesia herself, she confronted him backstage. 'That notebook isn't just old,' she said, showing him her research. 'It belonged to a comedian in the 1920s who became famous overnight and then disappeared after his final show, where half the audience laughed themselves into cardiac arrest.'"
  ],
  'Historical Fiction': [
    "June 17, 1863\nDearest Mother,\nWe have marched north into Pennsylvania. The officers speak of a great battle coming soon that may decide the course of the war. I try not to think of Thomas on the other side, wearing blue while I wear gray. Father would say he made his choice when he stayed in Boston rather than returning home to Virginia, but in my heart, he is still my brother. I keep the photograph of us fishing at the creek, taken the summer before the war, close to my heart.\nYour loving son,\nWilliam",
    "July 2, 1863\nDear Mother and Father,\nThe fighting here at Gettysburg has been terrible beyond words. Yesterday, our regiment was ordered to take a hill defended by the 20th Massachusetts. As we charged upward through the smoke, I saw a familiar face among the officers rallying the Union troops. Even with his beard and uniform, I would know Thomas anywhere. Our eyes met across the field for just a moment before the smoke of battle separated us again. I pray he survived the day.\nWith love and hope for peace,\nWilliam",
    "December 25, 1863\nMy dear family,\nI write to you from a Union field hospital near the Maryland border. I was wounded at Mine Run last month, and it was by God's grace alone that I was found by Union stretcher-bearers. The surgeon who saved my leg was none other than our Thomas. We have spent many hours talking of home and reconciliation. The war has changed us both, but not the bond we share. Thomas has arranged for me to be included in a prisoner exchange, so I may yet be home by spring. He asks me to tell you that despite everything, he still carries the pocket watch Father gave him, and reads the inscription daily: 'Family above all.'\nWith renewed hope,\nWilliam"
  ],
  'Thriller': [
    "The countdown appeared simultaneously on every digital display around the world at exactly 3:17 PM GMT. 168:00:00, counting down in seconds. No government claimed responsibility; no terrorist group issued demands. Within hours, global markets plunged, and widespread panic led to chaos in major cities. Dr. Reyna Vasquez, a cryptographer with the NSA, was tasked with finding the source of the signal and determining what would happen when the clock reached zero.",
    "By the time the countdown reached 120 hours, five strangers had received mysterious messages directing them to a remote location in Nevada. Zoe, a college student; Marcus, a retired military intelligence officer; Hikaru, a quantum computing specialist; Elena, a structural engineer; and David, a trauma surgeon. None knew why they had been selected, but each felt compelled to follow the instructions, driven by the conviction that the fate of millions depended on their cooperation.",
    "The five strangers converged at an abandoned research facility deep in the desert. 'I assume you all got the same message,' Marcus said as they gathered in the dusty control room. Before anyone could respond, the screens around them flickered to life, showing the countdown—now at 96:42:13—and a message: 'The previous occupants of this facility created something they couldn't control. In 4 days, it breaks free. Only the five of you, working together, can prevent global devastation. Begin with the locked room on sublevel 3. The code is different for each of you.'"
  ],
  'Drama': [
    "The Majestic Theater buzzed with anticipation on opening night of 'Shadows of the Heart.' After years of struggling in minor roles, Vanessa James had finally landed the lead in a Broadway production. Critics were already calling her performance in previews 'career-defining.' In her dressing room, surrounded by flowers, she touched up her makeup and tried to calm her nerves. The director knocked on her door. 'Five minutes to places,' he said with a reassuring smile. 'You were born for this role, Vanessa.'",
    "When the curtain rose for the second act, understudies Rebecca Chen and Marcus Dawson exchanged confused glances from the wings. Vanessa had not returned from intermission, and her quick change costume hung untouched. The stage manager was frantically trying to reach her on the radio. 'We have to make a decision now,' he whispered urgently to the director. After a moment's hesitation, he turned to Rebecca. 'Get in the costume. You're going on.' As Rebecca rushed to change, Marcus noticed something glittering on the floor near Vanessa's dressing room—her signature charm bracelet, with several links broken, as if it had been torn from her wrist.",
    "As Rebecca took her final bow to thunderous applause, detective Alicia Mendez was already examining security footage from the theater's back entrance. A hooded figure had escorted a woman who appeared to be Vanessa to a waiting car during intermission. Most disturbing was that Vanessa seemed to go willingly, even as she glanced back at the theater with what looked like regret. Among Vanessa's possessions, Mendez found a note written in elegant script: 'Some roles require the ultimate sacrifice. Tonight is just the beginning of your real performance.'"
  ]
};

// Seed function
async function seedContributions() {
  try {
    // Find all stories
    const stories = await Story.find({}).populate('creator');
    
    if (stories.length === 0) {
      console.error('No stories found. Please run seedStories.js first.');
      process.exit(1);
    }
    
    // Find some users to be contributors
    const users = await User.find({}).limit(5);
    
    if (users.length === 0) {
      console.error('No users found. Please create some users first.');
      process.exit(1);
    }
    
    // Delete existing contributions (optional)
    await Contribution.deleteMany({});
    console.log('Existing contributions deleted');
    
    let totalContributions = 0;
    
    // For each story, add appropriate contributions based on genre
    for (const story of stories) {
      const genre = story.genre;
      const contributions = sampleContributions[genre] || sampleContributions['Adventure']; // Default to Adventure if genre not found
      
      // Add contributions with different users
      for (let i = 0; i < contributions.length; i++) {
        const user = users[i % users.length]; // Cycle through available users
        
        const contribution = new Contribution({
          storyId: story._id,
          userId: user._id,
          content: contributions[i],
          status: 'approved',
          position: i + 1,
          isSelected: true,
          votes: {
            upvotes: Math.floor(Math.random() * 20),
            downvotes: Math.floor(Math.random() * 5)
          }
        });
        
        await contribution.save();
        totalContributions++;
        
        // Add user to story contributors if not already there
        if (!story.contributors.includes(user._id)) {
          await Story.findByIdAndUpdate(story._id, {
            $push: { contributors: user._id }
          });
        }
      }
    }
    
    console.log(`${totalContributions} sample contributions inserted successfully`);
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding contributions:', error);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

// Run the seed function
seedContributions();