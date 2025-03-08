const PropertyValuationForm = (props) => {

    const propertyValuationValidationSchema = Yup.object().shape({
        marketValue: Yup.string().required('Market Value is required'),
        forcedSaleValue: Yup.number().required('Forced Sale value is required').typeError("FSV must be a valid number"),
        insurenceValue: Yup.number().required("Insurence Value is required").typeError("Insurence value must be a valid number"),
        valuationDate: Yup.string().required("Valuation date is required"),
        annualGRossRentalIncome: Yup.number().required("Valuation date is required"),
        PropertyDescription: Yup.string(),
        InstructionDate: Yup.string().required("Instruction Date is required"),
        recipient: Yup.array().of(Yup.object().shape({
            value: Yup.string(),
            label: Yup.string(),
            name: Yup.string()
        })
        ).min(1, "Recipient required").max(1, "Only one recipient is required."),
        reportDocument: Yup
            .mixed()
            .required('Please upload a file')
            .nullable()
            .test('fileSize', 'File size is too large', (value) => {
                if (value[0]) {
                    return value[0].size <= 1024 * 1024 * 2;
                }
                return true;
            })
            .test('fileType', 'Only PDF files are allowed', (value) => {
                if (value[0]) {
                    return ['application/pdf', 'pdf'].includes(value[0].type);
                }
                return true;
            })
    });
    const { register: registerpropertyValuation, control, setValue: setPropertValuationValues, getValues: getValuationFormValuation, handleSubmit: handlePropertyValuationsSubmit, formState: { errors: propertyValuationErrors, isValid: propertyValuationIsValid } } = useForm({
        resolver: yupResolver(propertyValuationValidationSchema),
    });
    let recipientrecipientsList = useSelector(selectRecipientRecipients);
    return (
        <>
            <table className="table table-bordered table-responsive">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th><Button color="primary" onClick={addRecipient}>+</Button></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        (recipientrecipientsList != null) &&
                        recipientrecipientsList.map((existingRecipientRecipient, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="form-group">
                                        <div className="form-control-wrap">
                                            <Controller
                                                name={`recipientssold[${index}].name`}
                                                defaultValue={(existingRecipientRecipient?.name) ? existingRecipientRecipient?.name : ''}
                                                control={control}
                                                render={({ field }) => (
                                                    <input type="text" {...field} className="form-control" />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group">
                                        <div className="form-control-wrap">
                                            <Controller
                                                name={`recipientssold[${index}].email`}
                                                control={control}

                                                defaultValue={(existingRecipientRecipient?.email) ? existingRecipientRecipient?.email : ''}
                                                render={({ field }) => (
                                                    <input type="text" {...field} className="form-control" />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group">
                                        <div className="form-control-wrap">
                                            <Controller
                                                name={`recipientssold[${index}].phone`}
                                                defaultValue={(existingRecipientRecipient?.phone) ? existingRecipientRecipient?.phone : ''}
                                                control={control}
                                                render={({ field }) => (
                                                    <input type="text" {...field} className="form-control" />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <button type="button" onClick={() => removeRecipientold(index)} className="btn btn-danger">
                                        -
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </>
    )
}