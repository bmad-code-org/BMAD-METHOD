// Runs the quality chain silently; prints its output only when it fails.
import { spawnSync } from 'node:child_process';

const result = spawnSync('npm run -s quality', {
  shell: true,
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
});
if (result.status === 0) {
  console.log('quality: all checks passed');
} else {
  process.stdout.write(result.stdout ?? '');
  process.stderr.write(result.stderr ?? '');
  process.exit(result.status ?? 1);
}
