// components/ApplyButton.js
"use client";

import { Button } from '@/components/ui/button';
import { client } from '@/lib/prisma';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useToast } from '../ui/use-toast';
import { recruiterEmailTemplate, applicantEmailTemplate } from '@/helpers/emailTemplate';

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
			const recruiterResponse = await axios.post('/api/send-mail', {
				to: `${company?.email}`,
				name: user?.name,
				subject: `${internship?.name} Application`,
				body: recruiterEmailTemplate(user, internship),
			});
			const applicantResponse = await axios.post('/api/send-mail', {
				to: `${user?.email}`,
				name: user?.name,
				subject: `${internship?.name} Application`,
				body: applicantEmailTemplate(user, internship),
			});
			try {
				await axios.post('/api/checkApplied', {
					id: user.id,
					internshipId: internship.id,
				});
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
