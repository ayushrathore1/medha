import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../lib/motionPresets';

const challenges = [
  { number: '01', icon: '◷', eyebrow: 'TIME IS TIGHT', title: 'Too much syllabus. Too little time.', body: 'When exams get close, it is hard to decide what deserves your attention first.', solution: 'Start with a clearer plan' },
  { number: '02', icon: '▤', eyebrow: 'TOO MANY FILES', title: 'Notes scattered across chats.', body: 'PDFs, class notes and old question papers can make revision feel harder than it needs to be.', solution: 'Bring your prep into focus' },
  { number: '03', icon: '⌘', eyebrow: 'STUCK ON A CONCEPT', title: 'Reading it again is not helping.', body: 'Sometimes you need a simpler explanation, a useful example or a different way into the topic.', solution: 'Learn it in smaller steps' },
];

const PainSection = () => (
  <section className="pain-section premium-section">
    <div className="section-container premium-container">
      <motion.div {...fadeUp} className="premium-section-heading">
        <span className="premium-eyebrow">THE EXAM-SEASON REALITY</span>
        <h2>Studying is hard enough.<br /><span>Finding a starting point shouldn't be.</span></h2>
        <p>MEDHA helps you turn the pile of things to study into a set of next steps.</p>
      </motion.div>
      <div className="premium-challenge-grid">
        {challenges.map((item, index) => (
          <motion.article
            key={item.number}
            className="premium-challenge-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -5 }}
          >
            <div className="premium-card-topline"><span>{item.eyebrow}</span><span>{item.number}</span></div>
            <div className="premium-challenge-icon" aria-hidden="true">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <div className="premium-card-foot"><span>{item.solution}</span><span aria-hidden="true">↗</span></div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default PainSection;
