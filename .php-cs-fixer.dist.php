<?php

$finder = PhpCsFixer\Finder::create()
    ->in([
        __DIR__.'/src',
        __DIR__.'/tests',
    ])
    ->name('*.php')
    ->exclude('var')
    ->exclude('vendor')
    ->notPath('Kernel.php');

$config = new PhpCsFixer\Config();
return $config
    ->setRules([
        '@Symfony' => true,
        '@Symfony:risky' => true,
        '@PHP81Migration' => true,
        'binary_operator_spaces' => [
            'default' => 'align_single_space_minimal',
        ],
        'array_syntax' => ['syntax' => 'short'],
        'ordered_imports' => ['sort_algorithm' => 'alpha'],
        'not_operator_with_successor_space' => false,
        'trailing_comma_in_multiline' => ['elements' => ['arrays', 'arguments', 'parameters', 'match']],
        'single_quote' => true,
        'no_unused_imports' => true,
        'phpdoc_align' => ['align' => 'left'],
        'phpdoc_summary' => false,
        'simplified_null_return' => false, // This rule is risky for projects relying on specific null behavior
    ])
    ->setRiskyAllowed(true)
    ->setFinder($finder);