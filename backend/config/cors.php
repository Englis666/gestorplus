<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Allowed Methods
    |--------------------------------------------------------------------------
    |
    | The allowed HTTP methods for CORS requests.
    | By default, all HTTP methods are allowed.
    |
    */
    'allowed_methods' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | Allowed Origins
    |--------------------------------------------------------------------------
    |
    | Define which origins are allowed for CORS requests.
    | Set '*' to allow all origins.
    |
    */
    'allowed_origins' => ['http://localhost:3000'],


    /*
    |--------------------------------------------------------------------------
    | Allowed Headers
    |--------------------------------------------------------------------------
    |
    | The headers that are allowed for CORS requests.
    |
    */
    'allowed_headers' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | Exposed Headers
    |--------------------------------------------------------------------------
    |
    | Define which headers are exposed to browsers.
    |
    */
    'exposed_headers' => [],

    /*
    |--------------------------------------------------------------------------
    | Max Age
    |--------------------------------------------------------------------------
    |
    | The number of seconds the results of a preflight request can be cached.
    |
    */
    'max_age' => 0,

    /*
    |--------------------------------------------------------------------------
    | Supports Credentials
    |--------------------------------------------------------------------------
    |
    | Whether or not the response supports credentials (cookies, HTTP authentication, etc).
    |
    */
    'supports_credentials' => false,

];
