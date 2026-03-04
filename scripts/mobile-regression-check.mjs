import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const runStep = (label, command, args) => {
  console.log(`\n[mobile-regression] ${label}`);
  console.log(`[mobile-regression] $ ${command} ${args.join(' ')}`);

  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: false,
  });

  return result.status === 0;
};

const checks = [
  {
    label: 'Targeted lint',
    command: 'npx',
    args: [
      'eslint',
      'src/components/ServicesMarquee.tsx',
      'src/components/Portfolio.tsx',
      'src/components/Testimonials.tsx',
      'src/components/Navbar.tsx',
      'src/components/Hero.tsx',
      'src/pages/Index.tsx',
    ],
  },
  {
    label: 'Production build',
    command: 'npx',
    args: ['vite', 'build'],
  },
];

const results = checks.map((check) => ({
  label: check.label,
  ok: runStep(check.label, check.command, check.args),
}));

const allPass = results.every((result) => result.ok);
const isoNow = new Date().toISOString();
const statusIcon = (ok) => (ok ? '✅' : '❌');

const markdown = [
  '## Mobile Regression Checklist',
  '',
  `Generated at: \`${isoNow}\``,
  '',
  '### Automated checks',
  ...results.map((result) => `- ${statusIcon(result.ok)} ${result.label}`),
  '',
  '### Manual device checks (iPhone Safari)',
  '- [ ] Horizontal drag moves carousel left/right without jumping back to start.',
  '- [ ] Vertical page scroll works naturally when swiping over carousel area.',
  '- [ ] Tapping a card pauses/expands that card without resetting track position.',
  '- [ ] Tapping outside card closes expanded state and auto-scroll resumes smoothly.',
  '- [ ] Offscreen -> back onscreen transition resumes movement without visible snap.',
  '',
  '### Notes',
  '- Device/OS:',
  '- Browser version:',
  '- Repro video/screenshot path (if any):',
  '- Additional observations:',
  '',
];

const outputDir = resolve('tmp/mobile-regression');
const outputPath = resolve(outputDir, 'latest.md');
mkdirSync(outputDir, { recursive: true });
writeFileSync(outputPath, markdown.join('\n'));

console.log(`\n[mobile-regression] Wrote checklist to: ${outputPath}`);
console.log('[mobile-regression] Paste this block into the current change log entry.');

if (!allPass) {
  process.exit(1);
}

