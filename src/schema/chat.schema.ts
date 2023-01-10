import { array, object, string } from "yup";

export const createChatSchema = object({
  body: object().shape({
    memberIds: array()
      .typeError("MemberIds is required")
      .required("MemberIds is required"),
    type: string()
      .required("Field type is required")
      .test(
        "content",
        "Must be GROUP or SELF",
        (val) => val === "GROUP" || val === "SELF"
      ),
    // .when("partnerIds", (val: any) => {
    //   if (val?.length > 0) {
    //     return string().required("PartnerId must be is required");
    //   }
    //   return string().notRequired();
    // }),
  }),
});

export const addMemberSchema = object({
  body: object().shape({
    memberIds: array()
      .typeError("MemberIds is required")
      .required("MemberIds is required"),
    type: string()
      .required("Field type is required")
      .test(
        "content",
        "Must be GROUP or SELF",
        (val) => val === "GROUP" || val === "SELF"
      ),
    // .when("partnerIds", (val: any) => {
    //   if (val?.length > 0) {
    //     return string().required("PartnerId must be is required");
    //   }
    //   return string().notRequired();
    // }),
  }),
});
