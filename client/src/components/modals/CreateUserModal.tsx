interface CreateUserFuncProp {
  createUser: (username:string | null) => void
}

function CreateUserModal({createUser} :CreateUserFuncProp) {
  return(
    <>
      <h2
        className="text-center font-semibold text-xl mb-4 max-sm:text-md max-sm:mb-2"
      >
        Enter a username
      </h2>
      <form action={(formData: FormData) => createUser(formData.get("username") as string)}>
        <input 
            className="dialog-input"
            placeholder="Username"
            name="username"
            required
          />
          <button
            className="dialog-button"
          >
            Submit
          </button>
      </form>
    </>
  );
}

export default CreateUserModal;