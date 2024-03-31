<?php

declare(strict_types=1);

namespace App\Enum;

enum FinancialItemType: string
{
	case EXPENSE = 'expense';
	case INCOME = 'income';
}
