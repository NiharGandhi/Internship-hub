'use client';

import { useState, useRef } from "react";
import {
    KnockProvider,
    KnockFeedProvider,
    NotificationIconButton,
    NotificationFeedPopover,
    Spinner,
} from "@knocklabs/react";

// Required CSS import, unless you're overriding the styling
import "@knocklabs/react/dist/index.css";
import { useUser } from "@clerk/nextjs";

const NotificationFeed = () => {
    const [isVisible, setIsVisible] = useState(false);
    const notifButtonRef = useRef(null);

    const { user } = useUser();

    if (!user) return;

    return (
        <KnockProvider
            apiKey={"pk_FOk-yuDtTN0nGW_bfUO75ydTLRcAdJve1xE1RtXJlXU"}
            userId={user.id}
        >
            <KnockFeedProvider feedId={"85227000-76bd-45c8-a938-5352b0459d14"}>
                <>
                    <NotificationIconButton
                        ref={notifButtonRef}
                        onClick={(e) => setIsVisible(!isVisible)}
                    />
                    <NotificationFeedPopover
                        buttonRef={notifButtonRef}
                        isVisible={isVisible}
                        onClose={() => setIsVisible(false)}
                    />
                </>
            </KnockFeedProvider>
        </KnockProvider>
    );
};

export default NotificationFeed;