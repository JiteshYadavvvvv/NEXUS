## The skill contains brief about roles and their access in the app

1. Superadmins : They are three type of superadmins Director, JD (Joint director), Principal. They have access to create and delete organisations (clubs)
2. Organisation : It the model for club each club has 3 subroles: (faculty,seceretary, member) 
Organisation schema:
{
  "_id": { 
  },
  "name":
  "clubLogo": 
  "admins": [
    {
      "name": "abc",
      "email": "",
      "role": "faculty or secretary",
      "loginOtp": "",
      "loginOtpExpireAt": 0
    }
  ],
  "members": [
    {
      "$oid":
    },
    
  ],
  "forms": [
    {
      "$oid"
    }
  ],
  "instagramHandles": [
    "gdsc_aitpune"
  ]
}

3. Faculty : They have full power inside and organistion then can add and remove seceratries view forms created by club and see the responses and give reviews add members to the club
4. Secretary : They have similar power to that of Faculty but they cant add other secretary to the organisation. They can do rest all task such as managing members/ managing forms / managing reviews
5. Member : The only power they have is to give review to responses of the form. **They cant do anything** else
6. Applicant : They are users of the app. They dont hold any access powers

Any one inside the admin array in organisation have power to do all CRUD operations of the forms of that organisation it doesnt matter who created it 

superadmins/faculty/secretary have otp based login while member and applicant have also google login