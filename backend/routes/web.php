<?php

use App\Http\Controllers\FrontendBridgeController;
use App\Http\Controllers\PaymentPageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/payment/{result}', [PaymentPageController::class, 'show'])
    ->whereIn('result', ['success', 'pending', 'error']);

Route::get('/go-frontend/{path?}', [FrontendBridgeController::class, 'redirect'])
    ->where('path', '.*');

Route::get('/admin/{path?}', function (Request $request, FrontendBridgeController $bridge, ?string $path = null) {
    $frontendPath = trim('admin/'.($path ?? ''), '/');

    return $bridge->redirect($request, $frontendPath);
})->where('path', '.*');
