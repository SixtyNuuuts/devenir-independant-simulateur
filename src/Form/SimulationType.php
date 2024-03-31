<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\Activity;
use App\Entity\AnonymousUser;
use App\Entity\Simulation;
use App\Entity\User;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SimulationType extends AbstractType
{
	public function buildForm(FormBuilderInterface $builder, array $options): void
	{
		$builder
			->add('token')
			->add('activity', EntityType::class, [
				'class' => Activity::class,
				'choice_label' => 'id',
			])
			->add('user', EntityType::class, [
				'class' => User::class,
				'choice_label' => 'id',
			])
			->add('anonymousUser', EntityType::class, [
				'class' => AnonymousUser::class,
				'choice_label' => 'id',
			])
		;
	}

	public function configureOptions(OptionsResolver $resolver): void
	{
		$resolver->setDefaults([
			'data_class' => Simulation::class,
		]);
	}
}
