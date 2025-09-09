[
  {
    id: "0198b24b-2de2-1508-2915-486c33c230b6",
    isActive: true,
    createdBy: "Inactive User",
    createdByRole: null,
    createdAt: "2025-08-16T09:52:08.155Z",
    updatedBy: "Inactive User",
    updatedByRole: null,
    updatedAt: "2025-08-16T09:55:08.808Z",
    deletedBy: null,
    deletedByRole: null,
    deletedAt: null,
    approvalStatus: "pending",
    reviewReason: null,
    desktopCoverImage:
      "https://raceabove-dev.s3.ap-south-1.amazonaws.com/events/0198b24b-2de2-1508-2915-486c33c230b6/desktop.png",
    mobileCoverImage:
      "https://raceabove-dev.s3.ap-south-1.amazonaws.com/events/0198b24b-2de2-1508-2915-486c33c230b6/mobile.png",
    title: "Event Test ",
    description: "<p>test data save</p>",
    startDateTime: "2025-08-16T18:30:00.000Z",
    endDateTime: "2025-08-17T18:30:00.000Z",
    type: "in_person",
    coinsDiscountPercentage: "0.00",
    location: {
      id: "0198b24b-85f9-0173-e4e4-33109776f0f6",
      isActive: true,
      deletedAt: null,
      city: "Mumbai",
      state: "Maharashtra",
      address:
        "Borivali West, R/C Ward, Zone 4, Mumbai, Maharashtra, 400103, India",
      coordinate: {
        type: "Point",
        coordinates: [19.229635998, 72.848265728],
      },
    },
    coupons: [
      {
        id: "019808b2-1da5-e8bc-c9de-72728d89c23c",
        isActive: true,
        deletedAt: null,
        description: "description of coupon",
        code: "CODE12",
        discountType: "percentage",
        discountValue: "12.00",
        startTimeStamp: "2025-08-17T00:00:00.000Z",
        endTimeStamp: "2025-08-24T23:59:00.000Z",
      },
    ],
    addOns: [
      {
        id: "0198b24d-959b-15dd-4534-0f48018e85d4",
        isActive: true,
        deletedAt: null,
        quantity: 5,
        soldQuantity: 0,
        product: {
          id: "019808d1-b284-0ce3-9462-44d1408d8cd0",
          isActive: true,
          deletedAt: null,
          name: "Run Event Jersey",
          description:
            "The Great Inflate Run T-Shirt is a moisture-wicking polyester tee for Mumbai event participants. Featuring a vibrant logo, inflatable colors, and Mumbai skyline, it offers comfort for the 5K run.",
          image:
            "https://raceabove-dev.s3.ap-south-1.amazonaws.com/products/019808d1-b284-0ce3-9462-44d1408d8cd0/image.jpg",
          price: "499.00",
          category: {
            id: "0198b1b2-e4cb-383f-a44a-ecbccb91c907",
            isActive: true,
            deletedAt: null,
            name: "clothes",
            description: null,
          },
        },
      },
    ],
    forms: [
      {
        id: "0198b24d-958a-3215-a920-775e8752c795",
        isActive: true,
        deletedAt: null,
        fields: [
          {
            name: "full_name",
            type: "text",
            label: "Full Name",
            required: true,
          },
          {
            name: "email_address",
            type: "email",
            label: "Email Address",
            required: true,
          },
        ],
        formType: "registration",
        showTiming: "before_event",
      },
      {
        id: "0198b24d-958e-b8ee-9a9a-b84a585733ea",
        isActive: true,
        deletedAt: null,
        fields: [
          {
            name: "full_name",
            type: "text",
            label: "Full Name",
            required: true,
          },
          {
            name: "email_address",
            type: "email",
            label: "Email Address",
            required: true,
          },
          {
            name: "review",
            type: "text",
            label: "Review",
            options: [],
            required: false,
          },
          {
            name: "feedback",
            type: "text",
            label: "Feedback",
            options: [],
            required: true,
          },
        ],
        formType: "feedback",
        showTiming: "after_event",
      },
    ],
    announcements: [
      {
        id: "01989dae-2cbf-d018-a7d6-ceb85c38bae6",
        isActive: true,
        deletedAt: null,
        title: "Event Update: New Schedule",
        notificationSent: false,
      },
    ],
    category: {
      id: "0198a276-fc48-3ed3-3ba8-f5cc26171d62",
      name: "workshop",
    },
    frequentlyAskedQuestions: [
      {
        id: "0197d4c8-8b06-7088-b08f-b4a1b13fae76",
        isActive: true,
        deletedAt: null,
        question: " Who can participate here?",
        answer:
          "Anyone All ages and fitness levels are welcome. Children under a certain age may need to be accompanied by an adult.",
      },
    ],
    termsAndCondition: {
      id: "0197ed94-f07d-19e9-1d97-fc65b88844c2",
      isActive: true,
      deletedAt: null,
      content:
        "Terms & Conditions — Set 1\nParticipants must certify that they are physically fit and able to participate in the event.\n\nThe organizer is not liable for any lost or stolen personal belongings.\n\nWater stations will be provided at designated points; runners are advised to stay hydrated.\n\nEmergency medical assistance will be available along the course.\n\nParticipants must comply with all COVID-19 safety guidelines if applicable.\n\nThe official timing system must be used to qualify for prizes or certificates.",
    },
    privacyPolicy: {
      id: "01983b57-d499-6a9f-0993-9b7f6fd284c3",
      isActive: true,
      deletedAt: null,
      content:
        "Terms & Conditions —Set 2 Runners must follow the designated route and obey instructions from event staff and volunteers. Pets, bicycles, and unauthorized vehicles are not permitted on the course. Participants are responsible for their own medical insurance and assume all risks associated with participation. Any form of littering along the route is strictly prohibited. Participants must arrive at least 30",
    },
    organizer: {
      id: "0197ced9-e749-efb7-9cb6-7cc57fe50c69",
      name: "Aakanksha Gaikwad",
      phoneNumber: "+917678027610",
      email: "aakanksha.g@geteazr.com",
      companyName: "Eazr Digipayments Pvt. Ltd.",
      companyLogo:
        "https://raceabove-dev.s3.ap-south-1.amazonaws.com/organizers/0197ced9-e749-efb7-9cb6-7cc57fe50c69/company-logo.jpg",
    },
    reviewedBy: null,
    slots: [
      {
        id: "0198b24c-384f-860f-9e0d-64661c01d897",
        isActive: true,
        deletedAt: null,
        startDateTime: "2025-08-16T18:30:00.000Z",
        endDateTime: "2025-08-17T18:30:00.000Z",
        eventTickets: [
          {
            id: "0198b24c-3853-1f9d-4558-b7377908343e",
            isActive: true,
            createdBy: null,
            createdByRole: null,
            createdAt: "2025-08-16T09:53:16.301Z",
            updatedBy: null,
            updatedByRole: null,
            updatedAt: "2025-08-16T09:53:16.301Z",
            deletedBy: null,
            deletedByRole: null,
            deletedAt: null,
            approvalStatus: "pending",
            reviewReason: null,
            name: "Ticket 1",
            description: null,
            saleStartDateTime: "2025-08-16T18:30:00.000Z",
            saleEndDateTime: "2025-08-17T18:30:00.000Z",
            type: "paid",
            minAge: null,
            maxAge: null,
            minPerBooking: 1,
            maxPerBooking: 10,
            price: "500.00",
            discountedPrice: null,
            quantity: 100,
            bookedCount: 0,
          },
        ],
      },
    ],
    participations: [
      {
        id: "0198db9e-5e5a-309a-8682-ad9118fbeb21",
        createdAt: "2025-08-24T10:27:25.653Z",
        participationStatus: "cancelled",
        user: {
          id: "0197f889-3913-4092-76a5-0f5d1c032c87",
          isActive: true,
          name: "Hitesh Meghwal",
          profilePhoto:
            "https://raceabove-dev.s3.ap-south-1.amazonaws.com/users/0197f889-3913-4092-76a5-0f5d1c032c87/profile/photo.jpg",
        },
        participants: [
          {
            id: "0198db9e-5e6e-0fcb-4f1c-402e859a5213",
            isActive: true,
            formFields:
              '[{"label":"Full Name","name":"full_name","type":"text","multiple":false,"required":true,"values":"Hitesh"},{"label":"Age","name":"age","type":"number","multiple":false,"required":true,"values":"22"},{"label":"Gender","name":"gender","type":"radio","multiple":false,"required":true,"values":"Male"},{"label":"Blood Group","name":"blood_group","type":"select","multiple":false,"required":true,"values":"O+"},{"label":"Emergency Contact Name","name":"emergency_contact_name","type":"text","multiple":false,"required":true,"values":"8928597751"},{"label":"Emergency Contact Phone","name":"emergency_contact_phone","type":"phone","multiple":false,"required":true,"values":"8928597751"},{"label":"Running Experience","name":"running_experience","type":"select","multiple":false,"required":true,"values":"Advanced (2+ years)"}]',
            qrCode:
              "https://raceabove-dev.s3.ap-south-1.amazonaws.com/users/0197f889-3913-4092-76a5-0f5d1c032c87/event-participations/0198db9e-5e5a-309a-8682-ad9118fbeb21/participants/0198db9e-5e6e-0fcb-4f1c-402e859a5213.jpeg",
            isCheckedIn: false,
          },
        ],
        payment: {
          id: "0198db9e-5e52-f998-725d-599d1830ec1b",
          coinsUsed: "0.00",
          amountPaid: "11089.80",
          orderStatus: "terminated",
          paymentStatus: "cancelled",
        },
        addOns: [
          {
            id: "0198db9e-5d78-df94-edff-77b117679aa3",
            quantity: 1,
            price: "9090.00",
            totalPrice: "9090.00",
            addOn: {
              id: "0198adcd-b69b-131b-a3c6-574921f33fd4",
              quantity: 50,
              soldQuantity: 6,
              product: {
                id: "01983b00-ddd3-5817-c21a-ac7c5984d549",
                name: "Great Inflate Water Bottle",
                price: "9090.00",
              },
            },
          },
        ],
      },
    ],
    participationsCount: 0,
    participationsCountFormatted: "0",
  },
];
