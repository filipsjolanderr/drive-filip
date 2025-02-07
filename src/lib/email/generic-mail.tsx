import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Text,
    Tailwind,
    Section,
} from "@react-email/components";

interface GenericEmailProps {
    title: string;
    message: string;
    buttonText?: string;
    buttonLink?: string;
}

export const GenericEmail = ({ title, message, buttonText, buttonLink }: GenericEmailProps) => {
    const previewText = title;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans px-2">
                    <Container className="border border-solid border-gray-300 rounded my-10 mx-auto p-6 max-w-md">
                        <Heading className="text-black text-xl font-bold text-center">
                            {title}
                        </Heading>
                        <Text className="text-black text-sm">{message}</Text>
                        {buttonText && buttonLink && (
                            <Section className="text-center my-6">
                                <Button
                                    className="bg-black text-white text-sm font-semibold px-5 py-3 rounded"
                                    href={buttonLink}
                                >
                                    {buttonText}
                                </Button>
                            </Section>
                        )}
                        <Hr className="border-gray-300 my-6" />
                        <Text className="text-gray-600 text-xs">This is an automated message. Please do not reply.</Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};
