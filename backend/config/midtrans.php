<?php

return [
    'merchant_id' => env('MIDTRANS_MERCHANT_ID'),
    'client_key' => env('MIDTRANS_CLIENT_KEY'),
    'server_key' => env('MIDTRANS_SERVER_KEY'),
    'is_production' => filter_var(env('MIDTRANS_IS_PRODUCTION', false), FILTER_VALIDATE_BOOL),
    'ca_bundle' => env('MIDTRANS_CA_BUNDLE'),
    'disable_ssl_verify' => filter_var(env('MIDTRANS_DISABLE_SSL_VERIFY', false), FILTER_VALIDATE_BOOL),
];
