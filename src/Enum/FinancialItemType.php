<?php

namespace App\Enum;

enum FinancialItemType: string
{
    case EXPENSE = 'expense';
    case INCOME  = 'income';
}
