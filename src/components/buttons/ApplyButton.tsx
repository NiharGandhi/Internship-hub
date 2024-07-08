// components/ApplyButton.js
"use client";

import { Button } from '@/components/ui/button';
import { client } from '@/lib/prisma';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useToast } from '../ui/use-toast';

import { Knock } from "@knocklabs/node";

const KnockSecret = String(process.env.NEXT_PUBLIC_KNOCK_SECRET_KEY)

const knockClient = new Knock(KnockSecret);

const ApplyButton = ({ user, company, internship }:
	{ user: any, company: any, internship: any }) => {
	const [loading, setLoading] = useState(false);
	const [applied, setApplied] = useState(false); // State to track if email has been sent

	const { toast } = useToast();

	useEffect(() => {
		const checkApplicationStatus = async () => {
			try {
				const response = await axios.get('/api/checkApplied', {
					params: {
						userId: user.id,
						internshipId: internship.id,
					},
				});

				if (!(response.data === null)) {
					setApplied(true);
				}
			} catch (error) {
				console.error("Error checking application status:", error);
			}
		};

		checkApplicationStatus();
	}, [user.id, internship.id]);

	const applyInternship = async () => {
		setLoading(true);

		try {
			try {
				await axios.post('/api/checkApplied', {
					id: user.id,
					internshipId: internship.id,
				});

				await knockClient.workflows.trigger('application-created', {
					data: {
						name: user.name,
						email: user.email,
						primary_action_url: `www.internvista.tech/users/${user.id}`,
					},
					recipients: [
						{
							id: company.userId,
							name: company.name,
							email: company.email
						}
					],
				})
			} catch (error) {
				console.error("Error checking application status:", error);
			}
			toast({
				title: "Application Successful"
			})
			setApplied(true); // Update state to indicate email has been sent
		} catch (error) {
			toast({
				title: "Error While Applying",
				description: "Try again later"
			})
		} finally {
			setLoading(false);
		}
	};

	return (
		<Button onClick={applyInternship} disabled={loading || applied}>
			{loading ? 'Applying...' : (applied ? 'Applied' : 'Apply')}
		</Button>
	);
};

export default ApplyButton;
