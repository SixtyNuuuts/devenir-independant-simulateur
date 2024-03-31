<?php

$finder = PhpCsFixer\Finder::create()
    ->in([
        __DIR__ . '/src',
        __DIR__ . '/tests',
    ])
    ->name('*.php')
    ->exclude('var')
    ->exclude('vendor')
    ->notPath('Kernel.php');

$config = new PhpCsFixer\Config();
return $config
    ->setRules([
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
        '@PHPUnit30Migration:risky' => true,
        '@PHPUnit32Migration:risky' => true,
        '@PHPUnit35Migration:risky' => true,
        '@PHPUnit43Migration:risky' => true,
        '@PHPUnit48Migration:risky' => true,
        '@PHPUnit50Migration:risky' => true,
        '@PHPUnit52Migration:risky' => true,
        '@PHPUnit54Migration:risky' => true,
        '@PHPUnit55Migration:risky' => true,
        '@PHPUnit56Migration:risky' => true,
        '@PHPUnit57Migration:risky' => true,
        '@PHPUnit60Migration:risky' => true,
        '@PHPUnit75Migration:risky' => true,
        '@PHPUnit84Migration:risky' => true,
        '@PHP56Migration:risky' => true,
        '@PHP70Migration:risky' => true,
        '@PHP71Migration:risky' => true,
        '@PHP74Migration:risky' => true,
        '@PHP80Migration:risky' => true,
        '@PHP82Migration' => true,
        '@PER-CS2.0' => true,
        '@PER-CS2.0:risky' => true,
        '@PSR12' => true,
        '@PSR12:risky' => true,
        '@PhpCsFixer' => true,
        '@PhpCsFixer:risky' => true,
        '@Symfony' => true,
        '@Symfony:risky' => true,
        'yoda_style' => false,
    ])
    ->setRiskyAllowed(true)
    ->setFinder($finder)
    ->setIndent("\t")
    ->setLineEnding("\r\n");
