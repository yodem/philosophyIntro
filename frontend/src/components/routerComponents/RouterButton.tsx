import { Button, ButtonProps } from "@mui/material";
import { createLink, LinkComponent } from '@tanstack/react-router';
import { forwardRef } from "react";

interface MUILinkProps extends Omit<ButtonProps, 'href'> {
    // Add any additional props you want to pass to the button
}

const MUILinkComponent = forwardRef<HTMLAnchorElement, MUILinkProps>(
    (props, ref) => {
        return <Button component={'a'} ref={ref} {...props} />
    },
)

const CreatedLinkComponent = createLink(MUILinkComponent)

export const RouterButton: LinkComponent<typeof MUILinkComponent> = (props) => {
    return <CreatedLinkComponent preload={'intent'} {...props} />
}