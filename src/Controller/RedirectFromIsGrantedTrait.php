<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;

trait RedirectFromIsGrantedTrait
{
	public function redirectFromIsGranted(): RedirectResponse
	{
		if ($this->isGranted('ROLE_ADMIN')) {
			return $this->redirectToRoute('app_admin_home');
		}

		return $this->redirectToRoute('app_home');
	}
}
