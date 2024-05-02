<?php

declare(strict_types=1);

namespace App\Enum;

enum FinancialItemType: string
{
	case DEFAULT = 'default';
	case EXPENSE = 'expense';
	case INCOME = 'income';
}
