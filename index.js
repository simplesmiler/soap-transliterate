const soap = require('soap');
const { transliterate } = require('transliteration');

let soapBaseUrl = process.env.SOAP_BASE_URL;
if (!soapBaseUrl) {
    soapBaseUrl = 'https://soap-transliterate.simplesmiler.now.sh';
    // soapBaseUrl = 'http://192.168.0.13:1337';
    // soapBaseUrl = 'http://localhost:1337';
}
const port = process.env.PORT || 1337;

const wsdl = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://schemas.xmlsoap.org/wsdl/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:tns="${soapBaseUrl}" name="Lang" targetNamespace="${soapBaseUrl}">
    <types>
        <xs:schema elementFormDefault="qualified" targetNamespace="${soapBaseUrl}">
            <xs:element name="TransliterateRequest">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element name="InputText" type="xs:string"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
            <xs:element name="TransliterateResponse">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element name="OutputText" type="xs:string"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
        </xs:schema>
    </types>
    <message name="TransliterateSoapRequest">
        <part name="parameters" element="tns:TransliterateRequest"/>
    </message>
    <message name="TransliterateSoapResponse">
        <part name="parameters" element="tns:TransliterateResponse"/>
    </message>
    <portType name="LangSoapType">
        <operation name="Transliterate">
            <documentation>Returns the word corresponding to the positive number passed as parameter. Limited to quadrillions.</documentation>
            <input message="tns:TransliterateSoapRequest"/>
            <output message="tns:TransliterateSoapResponse"/>
        </operation>
    </portType>
    <binding name="LangSoapBinding" type="tns:LangSoapType">
        <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
        <operation name="Transliterate">
            <soap:operation soapAction="" style="document"/>
            <input>
                <soap:body use="literal"/>
            </input>
            <output>
                <soap:body use="literal"/>
            </output>
        </operation>
    </binding>
    <service name="Lang">
        <documentation>The Number Conversion Web Service, implemented with DataFlex, provides functions that convert numbers into words or dollar amounts.</documentation>
        <port name="LangSoap" binding="tns:LangSoapBinding">
            <soap:address location="${soapBaseUrl}/lang"/>
        </port>
    </service>
</definitions>
`;

const services = {
    Lang: {
        LangSoap: {
            Transliterate(args) {
                return { OutputText: transliterate(args.InputText) };
            },
        },
    },
};

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.raw({ type: () => true, limit: '5mb' }));

soap.listen(app, '/lang', services, wsdl);
app.listen(port);