import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Block, BlockContent, Button } from "../../components/Component";
const Unauthorized = () => {
    return (
        <>
            <Block className="nk-block-middle wide-xs mx-auto">
                <BlockContent className="nk-error-ld text-center">
                    <h1 className="nk-error-head">401</h1>
                    <h3 className="nk-error-title">Oops! Why you’re here?</h3>
                    <p className="nk-error-text">
                        You do not have the permission to view this page.
                    </p>
                    <Link to={`${process.env.PUBLIC_URL}/`}>
                        <Button color="primary" size="lg" className="mt-2">
                            Back To Home
                        </Button>
                    </Link>
                </BlockContent>
            </Block>
        </>
    );
};

export default Unauthorized;

