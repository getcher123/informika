<?php

$finder = PhpCsFixer\Finder::create()
    ->in([__DIR__ . '/local'])
    ->name('*.php')
    ->ignoreVCS(true)
    ->ignoreDotFiles(true);

return (new PhpCsFixer\Config())
    ->setRiskyAllowed(true)
    ->setRules([
        '@PSR12' => true,
        'array_syntax' => ['syntax' => 'short'],
        'no_unused_imports' => true,
        'single_quote' => true,
        'binary_operator_spaces' => ['default' => 'align_single_space_minimal'],
    ])
    ->setFinder($finder);
