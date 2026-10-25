<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class ServeRukys extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rukys:start {--port=8000 : The port to serve the application on} {--host=127.0.0.1 : The host address to serve the application on}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Start the Hajiya Rukys backend server with custom notifications';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $port = $this->option('port');
        $host = $this->option('host');

        $this->output->newLine();
        $this->line('<fg=yellow;options=bold>  ========================================================================</>');
        $this->line('<fg=cyan;options=bold>    ✨  HAJIYA RUKYS SCHOOL PORTAL BACKEND IS STARTING UP  ✨</>');
        $this->line('<fg=yellow;options=bold>  ========================================================================</>');
        $this->output->newLine();
        $this->line("  <fg=green;options=bold>🚀 Hajiya Rukys is running on port {$port}!</>");
        $this->line("  <fg=white>👉 Local URL:</>   <fg=cyan;options=underscore>http://{$host}:{$port}</>");
        $this->line("  <fg=white>👉 API Routes:</>  <fg=cyan;options=underscore>http://{$host}:{$port}/api</>");
        $this->line("  <fg=white>👉 Sanctum:</>     <fg=green>Active (http://{$host}:{$port}/sanctum/csrf-cookie)</>");
        $this->output->newLine();
        $this->line('<fg=gray>  Press Ctrl+C to stop the Hajiya Rukys server anytime.</>');
        $this->line('<fg=yellow;options=bold>  ========================================================================</>');
        $this->output->newLine();

        $binary = (new \Symfony\Component\Process\PhpExecutableFinder)->find(false);

        $process = new Process([$binary, 'artisan', 'serve', "--host={$host}", "--port={$port}"], base_path(), null, null, null);

        $process->run(function ($type, $buffer) {
            $this->output->write($buffer);
        });

        return Command::SUCCESS;
    }
}
