use std::fmt::Debug;

pub fn empty_result_val<T: Debug, E>(res: Result<T, E>) -> Result<(), E> {
    if res.is_ok() { Ok(()) }
    else { Err(res.unwrap_err()) }
}

pub fn empty_result_err<T, E: Debug>(res: Result<T, E>) -> Result<T, ()> {
    if res.is_ok() { Ok(res.unwrap()) }
    else { Err(()) }
}
