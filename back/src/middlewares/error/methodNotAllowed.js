class MethodNotAllowed extends Error {
  status = 405;
  constructor(message = '사용할 수 없는 메소드입니다.') {
    super(message);
    this.name = 'Method Not Allowed';
  }
}
export default MethodNotAllowed;
