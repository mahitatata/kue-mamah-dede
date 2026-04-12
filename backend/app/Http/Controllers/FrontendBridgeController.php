<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\View\View;
use Symfony\Component\HttpFoundation\RedirectResponse;

class FrontendBridgeController extends Controller
{
    public function redirect(Request $request, ?string $path = null): RedirectResponse|View
    {
        $frontendUrl = rtrim((string) env('FRONTEND_URL', 'http://localhost:5173'), '/');
        $reachableFrontendUrl = $this->findReachableFrontendUrl($frontendUrl);
        $cleanPath = trim((string) $path, '/');
        $targetBaseUrl = $reachableFrontendUrl ?? $frontendUrl;
        $target = $cleanPath === '' ? $targetBaseUrl : $targetBaseUrl.'/'.$cleanPath;
        $targetWithQuery = $target.$this->buildQuery($request);

        if ($reachableFrontendUrl) {
            return redirect()->away($targetWithQuery);
        }

        return view('frontend-offline', [
            'frontendUrl' => $frontendUrl,
            'targetUrl' => $targetWithQuery,
            'path' => $cleanPath === '' ? '/' : '/'.$cleanPath,
        ]);
    }

    private function buildQuery(Request $request): string
    {
        $query = http_build_query($request->query());

        return $query === '' ? '' : '?'.$query;
    }

    private function findReachableFrontendUrl(string $primaryUrl): ?string
    {
        $candidates = [$primaryUrl];
        $alternative = $this->swapLoopbackHost($primaryUrl);

        if ($alternative) {
            $candidates[] = $alternative;
        }

        foreach (array_unique($candidates) as $candidate) {
            try {
                $healthCheck = Http::timeout(2)->get($candidate);

                if ($healthCheck->successful() || $healthCheck->status() === 404) {
                    return rtrim($candidate, '/');
                }
            } catch (\Throwable) {
                // Try the next candidate URL.
            }
        }

        return null;
    }

    private function swapLoopbackHost(string $url): ?string
    {
        $parts = parse_url($url);
        $host = $parts['host'] ?? null;

        if (! is_string($host) || $host === '') {
            return null;
        }

        if ($host === '127.0.0.1') {
            $parts['host'] = 'localhost';
        } elseif ($host === 'localhost') {
            $parts['host'] = '127.0.0.1';
        } else {
            return null;
        }

        return $this->buildUrlFromParts($parts);
    }

    private function buildUrlFromParts(array $parts): string
    {
        $scheme = $parts['scheme'] ?? 'http';
        $host = $parts['host'] ?? 'localhost';
        $port = isset($parts['port']) ? ':'.$parts['port'] : '';
        $path = $parts['path'] ?? '';

        return $scheme.'://'.$host.$port.$path;
    }
}
