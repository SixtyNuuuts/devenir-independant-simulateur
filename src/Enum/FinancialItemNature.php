<?php

declare(strict_types=1);

namespace App\Enum;

enum FinancialItemNature: string
{
	case DEFAULT = 'default';
	case PROFESSIONAL = 'professional';
	case PERSONAL = 'personal';
}
